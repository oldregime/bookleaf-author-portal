import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.JWT_SECRET || "bookleaf_secure_jwt_secret_2026";

export interface AuthUser {
	userId: string;
	email: string;
	role: "admin" | "author";
	name: string;
	authorId?: string | null;
}

declare global {
	namespace Express {
		interface Request {
			user?: AuthUser;
		}
	}
}

export function generateToken(user: AuthUser): string {
	return jwt.sign(user, JWT_SECRET, { expiresIn: "7d" });
}

export function authenticate(
	req: Request,
	res: Response,
	next: NextFunction,
): void {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		res
			.status(401)
			.json({ error: "Unauthorized: Missing or invalid token format." });
		return;
	}

	const token = authHeader.split(" ")[1];
	try {
		const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
		req.user = decoded;
		next();
	} catch {
		res
			.status(401)
			.json({ error: "Unauthorized: Invalid or expired session token." });
	}
}

export function requireRole(role: "admin" | "author") {
	return (req: Request, res: Response, next: NextFunction): void => {
		if (!req.user) {
			res.status(401).json({ error: "Unauthorized: Authentication required." });
			return;
		}
		if (req.user.role !== role) {
			res
				.status(403)
				.json({
					error: `Forbidden: Access restricted to ${role} accounts only.`,
				});
			return;
		}
		next();
	};
}
