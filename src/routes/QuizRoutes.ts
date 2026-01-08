import { Router } from "express";
import { makeQuizController } from "../factories/QuizFactory";
import { authMiddleware } from "../middlewares/AuthMiddleware";
import { ensureTeacher } from "../middlewares/EnsureTeacher";


export const quizRoutes = Router();

const QuizController = makeQuizController();

quizRoutes.post('/quizzes', authMiddleware, ensureTeacher, QuizController.createQuiz);
quizRoutes.get('/quizzes', authMiddleware, QuizController.getAllQuizzes);
quizRoutes.get('/quizzes/teacher/:teacherId', authMiddleware, ensureTeacher, QuizController.getQuizzesByTeacherId);
quizRoutes.get('/quizzes/:id', authMiddleware, QuizController.getQuizById);
quizRoutes.put('/quizzes/:id', authMiddleware, ensureTeacher, QuizController.updateQuiz);
quizRoutes.delete('/quizzes/:id', authMiddleware, ensureTeacher, QuizController.deleteQuiz);