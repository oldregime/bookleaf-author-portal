import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getDbPath(): string {
	if (process.env.DB_PATH) {
		return process.env.DB_PATH;
	}
	const localPath = path.resolve(__dirname, "../../bookleaf.db");
	try {
		const testDb = new Database(localPath, { timeout: 1000 });
		testDb.exec("CREATE TABLE IF NOT EXISTS _test_lock (id INT)");
		testDb.close();
		return localPath;
	} catch {
		const homeDataDir = path.join(process.env.HOME || "/tmp", ".bookleaf_data");
		if (!fs.existsSync(homeDataDir)) {
			fs.mkdirSync(homeDataDir, { recursive: true });
		}
		return path.join(homeDataDir, "bookleaf.db");
	}
}

const dbPath = getDbPath();
export const db = new Database(dbPath, { timeout: 5000 });

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

export function initDatabase() {
	db.exec(`
    -- Users / Auth table
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('admin', 'author')),
      name TEXT NOT NULL,
      author_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Authors table
    CREATE TABLE IF NOT EXISTS authors (
      author_id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      city TEXT,
      joined_date TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Books table (MRP & royalty per copy can be NULL if the book is still in production)
    CREATE TABLE IF NOT EXISTS books (
      book_id TEXT PRIMARY KEY,
      author_id TEXT NOT NULL,
      title TEXT NOT NULL,
      isbn TEXT,
      genre TEXT,
      publication_date TEXT,
      status TEXT NOT NULL,
      mrp REAL,
      author_royalty_per_copy REAL,
      total_copies_sold INTEGER NOT NULL DEFAULT 0,
      total_royalty_earned REAL NOT NULL DEFAULT 0,
      royalty_paid REAL NOT NULL DEFAULT 0,
      royalty_pending REAL NOT NULL DEFAULT 0,
      last_royalty_payout_date TEXT,
      print_partner TEXT,
      available_on TEXT,
      FOREIGN KEY (author_id) REFERENCES authors(author_id) ON DELETE CASCADE
    );

    -- Support Tickets table
    CREATE TABLE IF NOT EXISTS tickets (
      ticket_id TEXT PRIMARY KEY,
      author_id TEXT NOT NULL,
      book_id TEXT,
      subject TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      category_override TEXT,
      priority TEXT NOT NULL,
      priority_override TEXT,
      status TEXT NOT NULL CHECK(status IN ('Open', 'In Progress', 'Resolved', 'Closed')) DEFAULT 'Open',
      assigned_to TEXT,
      internal_notes TEXT,
      ai_draft_response TEXT,
      ai_confidence REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (author_id) REFERENCES authors(author_id) ON DELETE CASCADE,
      FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE SET NULL
    );

    -- Ticket Messages (Thread)
    CREATE TABLE IF NOT EXISTS ticket_messages (
      message_id TEXT PRIMARY KEY,
      ticket_id TEXT NOT NULL,
      sender_role TEXT NOT NULL CHECK(sender_role IN ('author', 'admin', 'system')),
      sender_name TEXT NOT NULL,
      message TEXT NOT NULL,
      attachments TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (ticket_id) REFERENCES tickets(ticket_id) ON DELETE CASCADE
    );

    -- Recruiter / Evaluator Telemetry Beacons
    CREATE TABLE IF NOT EXISTS telemetry_logs (
      id TEXT PRIMARY KEY,
      ip TEXT,
      user_agent TEXT,
      path TEXT,
      action TEXT,
      metadata TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}
