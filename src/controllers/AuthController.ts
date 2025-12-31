import { AuthService } from "../services/AuthService";
import { Request, Response } from "express";

export class AuthController {

    private authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = authService;
    }

    loginTeacher = async (request: Request, response: Response): Promise<Response> => {
        const { email, password } = request.body;

        if (!email || !password) {
            return response.status(400).json({ error: "Email and password are required" });
        }

        try {
            const token = await this.authService.loginTeacher(email, password);
            return response.status(200).json({ token });
        } catch (error) {
            return response.status(401).json({ error: "Invalid credentials" });
        }
    }

    loginStudent = async (request: Request, response: Response): Promise<Response> => {
        const { enrollmentNumber } = request.body;

        if (!enrollmentNumber) {
            return response.status(400).json({ error: "Enrollment number is required" });
        }

        try {
            const token = await this.authService.loginStudent(enrollmentNumber);
            return response.status(200).json({ token });
        } catch (error) {
            return response.status(401).json({ error: "Invalid credentials" });
        }
    }
}
