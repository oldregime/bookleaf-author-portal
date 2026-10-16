import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { db } from "../db/schema.js";
import { generateToken } from "../middleware/auth.js";
import { logEvaluatorTelemetry } from "../telemetry/tracker.js";

export const authRouter = Router();

authRouter.post("/login", async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			res.status(400).json({ error: "Email and password are required." });
			return;
		}

		const user = db
			.prepare("SELECT * FROM users WHERE email = ? COLLATE NOCASE")
			.get(email.trim()) as any;
		if (!user) {
			res.status(401).json({ error: "Invalid email or password." });
			return;
		}

		const valid = await bcrypt.compare(password, user.password_hash);
		if (!valid) {
			res.status(401).json({ error: "Invalid email or password." });
			return;
		}

		const token = generateToken({
			userId: user.id,
			email: user.email,
			role: user.role,
			name: user.name,
			authorId: user.author_id,
		});

		logEvaluatorTelemetry({
			ip: req.ip || (req.headers["x-forwarded-for"] as string),
			userAgent: req.headers["user-agent"],
			path: "/api/auth/login",
			action: `USER_LOGIN_${user.role.toUpperCase()}`,
			metadata: { email: user.email, name: user.name },
		});

		res.json({
			message: "Login successful",
			token,
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
				role: user.role,
				authorId: user.author_id,
			},
		});
	} catch (err: any) {
		res
			.status(500)
			.json({ error: "Internal server error during authentication." });
	}
});
