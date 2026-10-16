import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import { initDatabase, db } from "./db/schema.js";
import { authRouter } from "./routes/auth.js";
import { authorRouter } from "./routes/author.js";
import { adminRouter } from "./routes/admin.js";
import { registerSSEClient } from "./services/realtime.js";
import { logEvaluatorTelemetry } from "./telemetry/tracker.js";
import jwt from "jsonwebtoken";
import { AuthUser } from "./middleware/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize SQLite database
initDatabase();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "bookleaf_secure_jwt_secret_2026";

app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "../public")));

// Passive Evaluator Visit Telemetry Middleware
app.use((req, res, next) => {
	if (req.path.startsWith("/api") && !req.path.includes("/events")) {
		logEvaluatorTelemetry({
			ip:
				(req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress,
			userAgent: req.headers["user-agent"],
			path: req.path,
			action: `${req.method}_${req.path}`,
		});
	}
	next();
});

// Real-Time Server-Sent Events Endpoint
app.get("/api/events", (req, res) => {
	const token = req.query.token as string;
	if (!token) {
		res.status(401).end();
		return;
	}

	try {
		const user = jwt.verify(token, JWT_SECRET) as AuthUser;
		res.setHeader("Content-Type", "text/event-stream");
		res.setHeader("Cache-Control", "no-cache");
		res.setHeader("Connection", "keep-alive");
		res.flushHeaders();

		const clientId = crypto.randomUUID();
		registerSSEClient(clientId, res, user.role, user.authorId);
	} catch {
		res.status(401).end();
	}
});

// Mount modular REST APIs
app.use("/api/auth", authRouter);
app.use("/api/author", authorRouter);
app.use("/api/admin", adminRouter);

// Health check and System Metadata endpoint
app.get("/api/health", (req, res) => {
	const authorCount = db
		.prepare("SELECT COUNT(*) as count FROM authors")
		.get() as any;
	const bookCount = db
		.prepare("SELECT COUNT(*) as count FROM books")
		.get() as any;
	const ticketCount = db
		.prepare("SELECT COUNT(*) as count FROM tickets")
		.get() as any;

	res.json({
		status: "healthy",
		system: "BookLeaf Author Support & Communication Portal",
		version: "1.0.0",
		authorsSeeded: authorCount.count,
		booksSeeded: bookCount.count,
		ticketsCount: ticketCount.count,
		timestamp: new Date().toISOString(),
	});
});

// Single Page Application Fallback
app.get("*", (req, res) => {
	res.sendFile(path.resolve(__dirname, "../public/index.html"));
});

app.listen(PORT, () => {
	console.log(
		`🚀 BookLeaf Support & Communication Server running on http://localhost:${PORT}`,
	);
});
