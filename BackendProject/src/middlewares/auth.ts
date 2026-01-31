import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "very_secret_change_me";

export interface AuthRequest extends Request {
    userId?: number;
    username?: string;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
    const auth = req.headers.authorization;
    
    if (!auth) {
        return res.status(401).json({ error: "No token provided" });
    }

    const parts = auth.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
        return res.status(401).json({ error: "Invalid token format" });
    }

    const token = parts[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const payload = decoded as unknown as { sub: number; username: string };
        
        req.userId = payload.sub;
        req.username = payload.username;
        
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid token" });
    }
}
