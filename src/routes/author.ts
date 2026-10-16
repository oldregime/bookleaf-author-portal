import { Router, Request, Response } from "express";
import crypto from "crypto";
import { db } from "../db/schema.js";
import { authenticate, requireRole } from "../middleware/auth.js";
import { analyzeTicketWithAI } from "../services/ai.js";
import { broadcastEvent } from "../services/realtime.js";

export const authorRouter = Router();

// Protect all author endpoints
authorRouter.use(authenticate, requireRole("author"));

/**
 * GET /api/author/books
 * Retrieves all books authored by the logged-in user
 */
authorRouter.get("/books", (req: Request, res: Response) => {
	try {
		const authorId = req.user!.authorId;
		if (!authorId) {
			res
				.status(400)
				.json({ error: "Author record not linked to this account." });
			return;
		}

		const books = db
			.prepare(
				"SELECT * FROM books WHERE author_id = ? ORDER BY publication_date DESC",
			)
			.all(authorId);

		// Parse JSON fields
		const parsed = books.map((b: any) => ({
			...b,
			available_on: b.available_on ? JSON.parse(b.available_on) : [],
		}));

		res.json({ books: parsed });
	} catch (err: any) {
		res.status(500).json({ error: "Failed to retrieve author books." });
	}
});

/**
 * GET /api/author/tickets
 * Retrieves all tickets raised by the author
 */
authorRouter.get("/tickets", (req: Request, res: Response) => {
	try {
		const authorId = req.user!.authorId;
		const tickets = db
			.prepare(`
      SELECT t.*, b.title as book_title
      FROM tickets t
      LEFT JOIN books b ON t.book_id = b.book_id
      WHERE t.author_id = ?
      ORDER BY t.created_at DESC
    `)
			.all(authorId);

		res.json({ tickets });
	} catch (err: any) {
		res.status(500).json({ error: "Failed to retrieve tickets." });
	}
});

/**
 * GET /api/author/tickets/:id
 * Retrieves ticket details and message thread
 */
authorRouter.get("/tickets/:id", (req: Request, res: Response) => {
	try {
		const authorId = req.user!.authorId;
		const ticketId = req.params.id;

		const ticket = db
			.prepare(`
      SELECT t.*, b.title as book_title
      FROM tickets t
      LEFT JOIN books b ON t.book_id = b.book_id
      WHERE t.ticket_id = ? AND t.author_id = ?
    `)
			.get(ticketId, authorId) as any;

		if (!ticket) {
			res.status(404).json({ error: "Ticket not found or access denied." });
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

		// Hide internal fields from author view
		delete ticket.internal_notes;
		delete ticket.ai_draft_response;

		res.json({ ticket, messages });
	} catch (err: any) {
		res.status(500).json({ error: "Failed to retrieve ticket thread." });
	}
});

/**
 * POST /api/author/tickets
 * Raises a new support ticket and triggers AI Auto-Classification & Draft Generation
 */
authorRouter.post("/tickets", async (req: Request, res: Response) => {
	try {
		const authorId = req.user!.authorId!;
		const authorName = req.user!.name;
		const { bookId, subject, description, attachmentName } = req.body;

		if (!subject || !subject.trim() || !description || !description.trim()) {
			res
				.status(400)
				.json({ error: "Subject and detailed description are required." });
			return;
		}

		let bookTitle: string | null = null;
		if (bookId) {
			const book = db
				.prepare("SELECT title FROM books WHERE book_id = ? AND author_id = ?")
				.get(bookId, authorId) as any;
			if (book) {
				bookTitle = book.title;
			}
		}

		// Trigger AI Auto-Classification & Draft Generation
		const aiResult = await analyzeTicketWithAI({
			subject: subject.trim(),
			description: description.trim(),
			authorName,
			bookTitle,
		});

		const ticketId = `TICK-${Math.floor(1000 + Math.random() * 9000)}`;

		const insertTicket = db.prepare(`
      INSERT INTO tickets (
        ticket_id, author_id, book_id, subject, description,
        category, priority, status, ai_draft_response, ai_confidence
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

		insertTicket.run(
			ticketId,
			authorId,
			bookId || null,
			subject.trim(),
			description.trim(),
			aiResult.category,
			aiResult.priority,
			"Open",
			aiResult.draftResponse,
			aiResult.confidence,
		);

		// Insert first message
		const insertMessage = db.prepare(`
      INSERT INTO ticket_messages (
        message_id, ticket_id, sender_role, sender_name, message, attachments
      ) VALUES (?, ?, ?, ?, ?, ?)
    `);

		const attachments = attachmentName
			? JSON.stringify([{ name: attachmentName }])
			: null;

		insertMessage.run(
			crypto.randomUUID(),
			ticketId,
			"author",
			authorName,
			description.trim(),
			attachments,
		);

		// Broadcast SSE to real-time clients
		broadcastEvent({
			type: "TICKET_CREATED",
			ticketId,
			authorId,
			data: {
				ticketId,
				subject,
				category: aiResult.category,
				priority: aiResult.priority,
				status: "Open",
				authorName,
			},
		});

		res.status(201).json({
			message: "Ticket submitted successfully",
			ticketId,
			category: aiResult.category,
			priority: aiResult.priority,
		});
	} catch (err: any) {
		res.status(500).json({ error: "Failed to create ticket: " + err.message });
	}
});

/**
 * POST /api/author/tickets/:id/reply
 * Adds author reply to existing ticket
 */
authorRouter.post("/tickets/:id/reply", (req: Request, res: Response) => {
	try {
		const authorId = req.user!.authorId!;
		const authorName = req.user!.name;
		const ticketId = req.params.id;
		const { message } = req.body;

		if (!message || !message.trim()) {
			res.status(400).json({ error: "Message cannot be empty." });
			return;
		}

		const ticket = db
			.prepare(
				"SELECT ticket_id, status FROM tickets WHERE ticket_id = ? AND author_id = ?",
			)
			.get(ticketId, authorId) as any;
		if (!ticket) {
			res.status(404).json({ error: "Ticket not found or unauthorized." });
			return;
		}

		const insertMsg = db.prepare(`
      INSERT INTO ticket_messages (message_id, ticket_id, sender_role, sender_name, message)
      VALUES (?, ?, ?, ?, ?)
    `);

		const messageId = crypto.randomUUID();
		insertMsg.run(messageId, ticketId, "author", authorName, message.trim());

		// Update ticket updated_at and re-open if it was resolved
		db.prepare(`
      UPDATE tickets
      SET updated_at = CURRENT_TIMESTAMP,
          status = CASE WHEN status = 'Resolved' THEN 'In Progress' ELSE status END
      WHERE ticket_id = ?
    `).run(ticketId);

		broadcastEvent({
			type: "NEW_MESSAGE",
			ticketId,
			authorId,
			data: {
				messageId,
				senderRole: "author",
				senderName: authorName,
				message: message.trim(),
				created_at: new Date().toISOString(),
			},
		});

		res.json({ message: "Reply sent successfully", messageId });
	} catch (err: any) {
		res.status(500).json({ error: "Failed to post reply." });
	}
});
