import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { fileURLToPath } from "url";
import { db, initDatabase } from "./schema.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seed() {
	console.log("🌱 Initializing BookLeaf SQLite database...");
	initDatabase();

	const dataPath = path.resolve(
		__dirname,
		"../../extracted_brief/FULLSTACK-SAMPLEDATA (1) (1).json",
	);
	if (!fs.existsSync(dataPath)) {
		throw new Error(`Sample dataset not found at ${dataPath}`);
	}

	const raw = fs.readFileSync(dataPath, "utf-8");
	const sampleData = JSON.parse(raw);

	const defaultPassword = "Password@123";
	const authorPasswordHash = await bcrypt.hash(defaultPassword, 10);
	const adminPasswordHash = await bcrypt.hash("Admin@BookLeaf2026", 10);

	// Clear existing
	db.exec("DELETE FROM ticket_messages");
	db.exec("DELETE FROM tickets");
	db.exec("DELETE FROM books");
	db.exec("DELETE FROM authors");
	db.exec("DELETE FROM users");

	// Insert Admin account
	const insertUser = db.prepare(`
    INSERT INTO users (id, email, password_hash, role, name, author_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

	insertUser.run(
		crypto.randomUUID(),
		"admin@bookleafpub.com",
		adminPasswordHash,
		"admin",
		"BookLeaf Ops Admin",
		null,
	);

	const insertAuthor = db.prepare(`
    INSERT INTO authors (author_id, name, email, phone, city, joined_date)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

	const insertBook = db.prepare(`
    INSERT INTO books (
      book_id, author_id, title, isbn, genre, publication_date, status,
      mrp, author_royalty_per_copy, total_copies_sold, total_royalty_earned,
      royalty_paid, royalty_pending, last_royalty_payout_date, print_partner, available_on
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

	for (const author of sampleData.authors) {
		insertAuthor.run(
			author.author_id,
			author.name,
			author.email,
			author.phone,
			author.city,
			author.joined_date,
		);

		// Insert user record for author login
		insertUser.run(
			crypto.randomUUID(),
			author.email.toLowerCase(),
			authorPasswordHash,
			"author",
			author.name,
			author.author_id,
		);

		if (author.books && Array.isArray(author.books)) {
			for (const book of author.books) {
				insertBook.run(
					book.book_id,
					author.author_id,
					book.title,
					book.isbn || null,
					book.genre,
					book.publication_date || null,
					book.status,
					book.mrp,
					book.author_royalty_per_copy,
					book.total_copies_sold,
					book.total_royalty_earned,
					book.royalty_paid,
					book.royalty_pending,
					book.last_royalty_payout_date || null,
					book.print_partner || null,
					JSON.stringify(book.available_on || []),
				);
			}
		}
	}

	// Pre-seed realistic initial tickets to showcase the queue immediately
	const insertTicket = db.prepare(`
    INSERT INTO tickets (
      ticket_id, author_id, book_id, subject, description,
      category, priority, status, assigned_to, internal_notes, ai_draft_response
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

	const insertMessage = db.prepare(`
    INSERT INTO ticket_messages (
      message_id, ticket_id, sender_role, sender_name, message
    ) VALUES (?, ?, ?, ?, ?)
  `);

	// Sample Ticket 1: Urgent Royalty Query
	const t1Id = "TICK-1001";
	insertTicket.run(
		t1Id,
		"AUTH001",
		"BK001",
		"Pending royalty payout for Q3",
		"Hi BookLeaf team, I see royalty pending of ₹3,570 on Whispers of the Ganges. The last payout was October 15. When will this be credited to my linked bank account?",
		"Royalty & Payments",
		"High",
		"Open",
		null,
		"Verified author bank details are on file. Pending Q4 payout cycle.",
		"Dear Priya, Thank you for reaching out regarding your pending royalty of ₹3,570 for Whispers of the Ganges. BookLeaf calculates and disburses royalties quarterly within 45 days of quarter close. Our finance team is currently processing the current cycle, and you can expect direct bank credit by November 15. Please let us know if your bank details have changed.",
	);

	insertMessage.run(
		crypto.randomUUID(),
		t1Id,
		"author",
		"Priya Sharma",
		"Hi BookLeaf team, I see royalty pending of ₹3,570 on Whispers of the Ganges. The last payout was October 15. When will this be credited to my linked bank account?",
	);

	// Sample Ticket 2: ISBN Error
	const t2Id = "TICK-1002";
	insertTicket.run(
		t2Id,
		"AUTH002",
		"BK003",
		"Amazon listing shows duplicate ISBN",
		"My book Echoes of the Valley has a different ISBN on Amazon India compared to my proof copy. Readers cannot find the edition.",
		"ISBN & Metadata Issues",
		"Critical",
		"In Progress",
		"BookLeaf Ops Admin",
		"Escalated to production desk. Amazon metadata re-sync dispatched.",
		"Dear Rohit, We acknowledge this is a high-priority metadata issue. We have escalated your ISBN mapping directly to our distribution and production desks. Our team is triggering an expedited Amazon India catalog re-sync, which will reflect the correct ISBN within 24 to 48 hours. We sincerely apologize for this inconvenience.",
	);

	insertMessage.run(
		crypto.randomUUID(),
		t2Id,
		"author",
		"Rohit Kapoor",
		"My book Echoes of the Valley has a different ISBN on Amazon India compared to my proof copy. Readers cannot find the edition.",
	);

	insertMessage.run(
		crypto.randomUUID(),
		t2Id,
		"admin",
		"BookLeaf Ops Admin",
		"Dear Rohit, We acknowledge this is a high-priority metadata issue. We have escalated your ISBN mapping directly to our distribution and production desks. Our team is triggering an expedited Amazon India catalog re-sync, which will reflect the correct ISBN within 24 to 48 hours.",
	);

	console.log(`✅ Successfully seeded:
- 1 Admin account (admin@bookleafpub.com / Admin@BookLeaf2026)
- ${sampleData.authors.length} Authors (Password: Password@123)
- 18 Books with full royalty, status, and platform metadata
- 2 Seeded Tickets showcasing Queue and AI response states`);
}

seed().catch((err) => {
	console.error("❌ Seeding failed:", err);
	process.exit(1);
});
