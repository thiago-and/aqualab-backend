import { Router } from "express";
import { makeQuizController } from "../../factories/QuizFactory";
import { ensureAuthenticated } from "../../middlewares/ensureAuthenticated";
import { ensureTeacher } from "../../middlewares/EnsureTeacher";

export const quizRoutes = Router();

const QuizController = makeQuizController();

quizRoutes.post('/quizzes', ensureAuthenticated, ensureTeacher, QuizController.createQuiz);
quizRoutes.get('/quizzes', ensureAuthenticated, QuizController.getAllQuizzes);
quizRoutes.get('/quizzes/teacher/:teacherId', ensureAuthenticated, ensureTeacher, QuizController.getQuizzesByTeacherId);
quizRoutes.get('/quizzes/:id', ensureAuthenticated, QuizController.getQuizById);
quizRoutes.put('/quizzes/:id', ensureAuthenticated, ensureTeacher, QuizController.updateQuiz);
quizRoutes.delete('/quizzes/:id', ensureAuthenticated, ensureTeacher, QuizController.deleteQuiz);