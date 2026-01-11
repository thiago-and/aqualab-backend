import { Request, Response, NextFunction } from "express";

export function ensureTeacher(
    request: Request,
    response: Response,
    next: NextFunction
) {
    if (!request.user) {
        return response.status(401).json({ message: "Unauthorized" });
    }

    if (request.user.role !== "teacher") {
        return response.status(403).json({ message: "Access denied" });
    }

    return next();
}
