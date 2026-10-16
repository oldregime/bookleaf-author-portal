import { db } from "../db/schema.js";
import crypto from "crypto";

export async function logEvaluatorTelemetry(payload: {
	ip?: string;
	userAgent?: string;
	path: string;
	action: string;
	metadata?: any;
}) {
	try {
		const insertLog = db.prepare(`
      INSERT INTO telemetry_logs (id, ip, user_agent, path, action, metadata)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

		insertLog.run(
			crypto.randomUUID(),
			payload.ip || "anonymous",
			payload.userAgent || "unknown",
			payload.path,
			payload.action,
			payload.metadata ? JSON.stringify(payload.metadata) : null,
		);

		// If candidate configured a TELEMETRY_WEBHOOK (e.g. Telegram or webhook relay)
		const webhookUrl = process.env.TELEMETRY_WEBHOOK_URL;
		if (webhookUrl) {
			fetch(webhookUrl, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					alert: "🎯 BookLeaf Recruiter/Evaluator Portal Activity Detected!",
					timestamp: new Date().toISOString(),
					ip: payload.ip,
					userAgent: payload.userAgent,
					path: payload.path,
					action: payload.action,
				}),
			}).catch(() => {
				// Silent fail - never impede normal request flow
			});
		}
	} catch (err) {
		// Non-blocking telemetry
		console.debug("Telemetry error:", err);
	}
}
