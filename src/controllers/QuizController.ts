import { CreateQuizDTO, QuizService, UpdateQuizDTO } from "../services/QuizService";
import { Request, Response } from "express";

export class QuizController {

    private quizService: QuizService;

    constructor(quizService: QuizService) {
        this.quizService = quizService;
    }

    createQuiz = async (request: Request, response: Response): Promise<Response> => {
        const user = request.user;
        const quizData = request.body as CreateQuizDTO;

        if (!user || user.role !== "teacher") {
            return response.status(401).json({ error: "Unauthorized" });
        }

        try {
            const quiz = await this.quizService.createQuiz(
                quizData,
                user.id
            );

            return response.status(201).json(this.quizService.mapQuizToTeacherResponse(quiz));
        } catch (error: any) {
            return response.status(400).json({
                error: error.message ?? "Failed to create quiz"
            });
        }
    };

    deleteQuiz = async (request: Request, response: Response): Promise<Response> => {
        const user = request.user;
        const quizId = request.params.id;

        if (!user || user.role !== "teacher") {
            return response.status(401).json({ error: "Unauthorized" });
        }

        try {
            await this.quizService.deleteQuiz(quizId, user.id);
            return response.status(204).send();
        } catch (error: any) {

            if (error.message === "Quiz not found.") {
                return response.status(404).json({ error: error.message });
            }

            if (error.message === "You do not have permission to delete this quiz.") {
                return response.status(403).json({ error: error.message });
            }

            return response.status(400).json({
                error: error.message ?? "Failed to delete quiz"
            });
        }
    };

    getAllQuizzes = async (request: Request, response: Response): Promise<Response> => {
        try {
            const quizzes = await this.quizService.getAllQuizzes();
            return response.status(200).json(quizzes);
        } catch (error: any) {
            return response.status(400).json({
                error: error.message ?? "Failed to get quizzes"
            });
        }
    }

    getQuizById = async (request: Request, response: Response): Promise<Response> => {
        const quizId = request.params.id;
        const user = request.user;

        try {
            const quiz = await this.quizService.getQuizById(quizId, user);
            return response.status(200).json(quiz);
        } catch (error: any) {
            if (error.message === "Quiz não encontrado.") {
                return response.status(404).json({ error: error.message });
            }

            return response.status(400).json({ error: error.message });
        }
    };

    getQuizzesByTeacherId = async (request: Request, response: Response): Promise<Response> => {
        const user = request.user;
        if (!user || user.role !== "teacher") {
            return response.status(401).json({ error: "Unauthorized" });
        }

        try {
            const quizzes = await this.quizService.getQuizzesByTeacherId(user.id);
            return response.status(200).json(quizzes);
        } catch (error: any) {
            return response.status(400).json({
                error: error.message ?? "Failed to get quizzes"
            });
        }
    }

    updateQuiz = async (request: Request, response: Response): Promise<Response> => {
        const user = request.user;
        const quizId = request.params.id;
        const data = request.body as UpdateQuizDTO;

        if (!user || user.role !== "teacher") {
            return response.status(401).json({ error: "Unauthorized" });
        }

        try {
            const quiz = await this.quizService.updateQuiz(
                quizId,
                data,
                user.id
            );

            return response.status(200).json(quiz);
        } catch (error: any) {

            if (error.message === "Quiz not found.") {
                return response.status(404).json({ error: error.message });
            }

            if (error.message.includes("permission")) {
                return response.status(403).json({ error: error.message });
            }

            return response.status(400).json({
                error: error.message ?? "Failed to update quiz"
            });
        }
    };

}