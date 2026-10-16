import { Router, Request, Response } from "express";
import crypto from "crypto";
import { db } from "../db/schema.js";
import { authenticate, requireRole } from "../middleware/auth.js";
import { OFFICIAL_CATEGORIES, analyzeTicketWithAI } from "../services/ai.js";
import { broadcastEvent } from "../services/realtime.js";

export const adminRouter = Router();

// Protect all admin endpoints
adminRouter.use(authenticate, requireRole("admin"));

/**
 * GET /api/admin/tickets
 * Unified ticket queue with filtering, search, and smart aging/urgency sorting
 */
adminRouter.get("/tickets", (req: Request, res: Response) => {
	try {
		const { status, category, priority, search } = req.query;

		let query = `
      SELECT t.*, a.name as author_name, a.email as author_email, b.title as book_title
      FROM tickets t
      JOIN authors a ON t.author_id = a.author_id
      LEFT JOIN books b ON t.book_id = b.book_id
      WHERE 1=1
    `;
		const params: any[] = [];

		if (status) {
			query += " AND t.status = ?";
			params.push(status);
		}
		if (category) {
			query +=
				" AND (t.category_override = ? OR (t.category_override IS NULL AND t.category = ?))";
			params.push(category, category);
		}
		if (priority) {
			query +=
				" AND (t.priority_override = ? OR (t.priority_override IS NULL AND t.priority = ?))";
			params.push(priority, priority);
		}
		if (search) {
			query +=
				" AND (t.subject LIKE ? OR t.description LIKE ? OR a.name LIKE ? OR t.ticket_id LIKE ?)";
			const term = `%${search}%`;
			params.push(term, term, term, term);
		}

		// Sort: Priority weight (Critical > High > Medium > Low), then oldest unresolved first
		query += `
      ORDER BY 
        CASE t.status WHEN 'Open' THEN 1 WHEN 'In Progress' THEN 2 WHEN 'Resolved' THEN 3 ELSE 4 END ASC,
        CASE COALESCE(t.priority_override, t.priority)
          WHEN 'Critical' THEN 1
          WHEN 'High' THEN 2
          WHEN 'Medium' THEN 3
          WHEN 'Low' THEN 4
          ELSE 5
        END ASC,
        t.created_at ASC
    `;

		const tickets = db.prepare(query).all(...params);
		res.json({ tickets });
	} catch (err: any) {
		res.status(500).json({ error: "Failed to retrieve ticket queue." });
	}
});

/**
 * GET /api/admin/tickets/:id
 * Retrieves full ticket detail including AI draft, author history, and notes
 */
adminRouter.get("/tickets/:id", (req: Request, res: Response) => {
	try {
		const ticketId = req.params.id;
		const ticket = db
			.prepare(`
      SELECT t.*, a.name as author_name, a.email as author_email, a.phone as author_phone,
             b.title as book_title, b.isbn as book_isbn, b.status as book_status,
             b.total_royalty_earned, b.royalty_pending
      FROM tickets t
      JOIN authors a ON t.author_id = a.author_id
      LEFT JOIN books b ON t.book_id = b.book_id
      WHERE t.ticket_id = ?
    `)
			.get(ticketId) as any;

		if (!ticket) {
			res.status(404).json({ error: "Ticket not found." });
			return;
		}

		const messages = db
			.prepare(`
      SELECT message_id, sender_role, sender_name, message, attachments, created_at
      FROM ticket_messages
      WHERE ticket_id = ?
      ORDER BY created_at ASC
    `)
			.all(ticketId);

		res.json({ ticket, messages, availableCategories: OFFICIAL_CATEGORIES });
	} catch (err: any) {
		res.status(500).json({ error: "Failed to load ticket details." });
	}
});

/**
 * PATCH /api/admin/tickets/:id
 * Admin overrides: category, priority, status, internal notes, assigned admin
 */
adminRouter.patch("/api/admin/tickets/:id", (req: Request, res: Response) => {
	try {
		const ticketId = req.params.id;
		const {
			category_override,
			priority_override,
			status,
			internal_notes,
			assigned_to,
		} = req.body;

		const existing = db
			.prepare("SELECT * FROM tickets WHERE ticket_id = ?")
			.get(ticketId) as any;
		if (!existing) {
			res.status(404).json({ error: "Ticket not found." });
			return;
		}

		const updates: string[] = [];
		const values: any[] = [];

		if (category_override !== undefined) {
			updates.push("category_override = ?");
			values.push(category_override || null);
		}
		if (priority_override !== undefined) {
			updates.push("priority_override = ?");
			values.push(priority_override || null);
		}
		if (status !== undefined) {
			updates.push("status = ?");
			values.push(status);
		}
		if (internal_notes !== undefined) {
			updates.push("internal_notes = ?");
			values.push(internal_notes);
		}
		if (assigned_to !== undefined) {
			updates.push("assigned_to = ?");
			values.push(assigned_to);
		}

		updates.push("updated_at = CURRENT_TIMESTAMP");
		values.push(ticketId);

		db.prepare(
			`UPDATE tickets SET ${updates.join(", ")} WHERE ticket_id = ?`,
		).run(...values);

		broadcastEvent({
			type: "TICKET_UPDATED",
			ticketId,
			authorId: existing.author_id,
			data: { ticketId, status, category_override, priority_override },
		});

		res.json({ message: "Ticket updated successfully." });
	} catch (err: any) {
		res.status(500).json({ error: "Failed to update ticket: " + err.message });
	}
});

/**
 * POST /api/admin/tickets/:id/reply
 * Dispatches admin response to author and updates status to In Progress or Resolved
 */
adminRouter.post("/tickets/:id/reply", (req: Request, res: Response) => {
	try {
		const ticketId = req.params.id;
		const adminName = req.user!.name;
		const { message, resolveTicket } = req.body;

		if (!message || !message.trim()) {
			res.status(400).json({ error: "Response message cannot be empty." });
			return;
		}

		const ticket = db
			.prepare("SELECT author_id FROM tickets WHERE ticket_id = ?")
			.get(ticketId) as any;
		if (!ticket) {
			res.status(404).json({ error: "Ticket not found." });
			return;
		}

		const insertMsg = db.prepare(`
      INSERT INTO ticket_messages (message_id, ticket_id, sender_role, sender_name, message)
      VALUES (?, ?, ?, ?, ?)
    `);

		const messageId = crypto.randomUUID();
		insertMsg.run(messageId, ticketId, "admin", adminName, message.trim());

		const newStatus = resolveTicket ? "Resolved" : "In Progress";
		db.prepare(
			"UPDATE tickets SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE ticket_id = ?",
		).run(newStatus, ticketId);

		broadcastEvent({
			type: "NEW_MESSAGE",
			ticketId,
			authorId: ticket.author_id,
			data: {
				messageId,
				senderRole: "admin",
				senderName: adminName,
				message: message.trim(),
				created_at: new Date().toISOString(),
			},
		});

		broadcastEvent({
			type: "TICKET_UPDATED",
			ticketId,
			authorId: ticket.author_id,
			data: { ticketId, status: newStatus },
		});

		res.json({
			message: "Response sent successfully to author.",
			messageId,
			status: newStatus,
		});
	} catch (err: any) {
		res.status(500).json({ error: "Failed to send response." });
	}
});

/**
 * POST /api/admin/tickets/:id/regenerate-draft
 * Regenerates an AI response draft on demand
 */
adminRouter.post(
	"/tickets/:id/regenerate-draft",
	async (req: Request, res: Response) => {
		try {
			const ticketId = req.params.id;
			const ticket = db
				.prepare(`
      SELECT t.*, a.name as author_name, b.title as book_title
      FROM tickets t
      JOIN authors a ON t.author_id = a.author_id
      LEFT JOIN books b ON t.book_id = b.book_id
      WHERE t.ticket_id = ?
    `)
				.get(ticketId) as any;

			if (!ticket) {
				res.status(404).json({ error: "Ticket not found." });
				return;
			}

			const aiResult = await analyzeTicketWithAI({
				subject: ticket.subject,
				description: ticket.description,
				authorName: ticket.author_name,
				bookTitle: ticket.book_title,
			});

			db.prepare(`
      UPDATE tickets
      SET ai_draft_response = ?, ai_confidence = ?, updated_at = CURRENT_TIMESTAMP
      WHERE ticket_id = ?
    `).run(aiResult.draftResponse, aiResult.confidence, ticketId);

			res.json({
				draftResponse: aiResult.draftResponse,
				confidence: aiResult.confidence,
			});
		} catch (err: any) {
			res.status(500).json({ error: "Failed to regenerate AI draft." });
		}
	},
);
