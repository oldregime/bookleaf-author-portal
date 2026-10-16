import { Response } from "express";

// In-memory registry of active SSE clients
interface SSEClient {
	id: string;
	res: Response;
	role: "admin" | "author";
	authorId?: string | null;
}

const clients: Map<string, SSEClient> = new Map();

export function registerSSEClient(
	id: string,
	res: Response,
	role: "admin" | "author",
	authorId?: string | null,
) {
	clients.set(id, { id, res, role, authorId });

	// Send initial connection ping
	res.write(
		`data: ${JSON.stringify({ type: "CONNECTED", timestamp: new Date().toISOString() })}\n\n`,
	);

	// Periodic heartbeat every 25 seconds to keep connection alive
	const keepAlive = setInterval(() => {
		res.write(": keepalive\n\n");
	}, 25000);

	res.on("close", () => {
		clearInterval(keepAlive);
		clients.delete(id);
	});
}

export function broadcastEvent(event: {
	type: "TICKET_CREATED" | "TICKET_UPDATED" | "NEW_MESSAGE";
	ticketId: string;
	authorId?: string;
	data: any;
}) {
	const payload = `data: ${JSON.stringify(event)}\n\n`;

	for (const client of clients.values()) {
		// Admins receive all updates
		if (client.role === "admin") {
			client.res.write(payload);
		}
		// Authors receive updates only if they own the ticket
		else if (
			client.role === "author" &&
			client.authorId &&
			client.authorId === event.authorId
		) {
			client.res.write(payload);
		}
	}
}
