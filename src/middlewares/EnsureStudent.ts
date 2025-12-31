import { Request, Response, NextFunction } from "express";

export function ensureStudent(
    request: Request,
    response: Response,
    next: NextFunction
) {
    if (!request.user) {
        return response.status(401).json({ message: "Unauthorized" });
    }

    if (request.user.role !== "student") {
        return response.status(403).json({ message: "Access denied" });
    }

    return next();
}