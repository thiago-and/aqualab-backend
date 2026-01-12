import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

interface JwtPayload {
    sub: string;
    role: 'student' | 'teacher';
}

export function ensureAuthenticated(
    request: Request,
    response: Response,
    next: NextFunction
) {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        return response.status(401).json({ message: "Token não fornecido" });
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2) {
        return response.status(401).json({ message: "Erro no token" });
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
        return response.status(401).json({ message: "Token mal formatado" });
    }

    try {
        const decoded = verify(
            token,
            process.env.JWT_SECRET as string
        ) as JwtPayload;

        request.user = {
            id: decoded.sub,
            role: decoded.role
        };

        return next();
    } catch {
        return response.status(401).json({ message: "Token inválido" });
    }
}
