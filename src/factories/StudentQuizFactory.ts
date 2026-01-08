import { StudentQuizController } from "../controllers/quizzes/StudentQuizController";
import { AppDataSource } from "../database/data-source";
import { StudentQuizRepository } from "../repositories/quizzes/StudentQuizRepository";
import { QuizAttemptRepository } from "../repositories/quizzes/QuizAttemptRepository";
import { StudentAnswerRepository } from "../repositories/quizzes/StudentAnswerRepository";
import { StudentQuizService } from "../services/quizzes/StudentQuizService";

export function makeStudentQuizController() {

    const manager = AppDataSource.manager;
    const studentQuizRepository = new StudentQuizRepository(manager);
    const quizAttemptRepository = new QuizAttemptRepository(manager);
    const studentAnswerRepository = new StudentAnswerRepository(manager);
    const studentQuizService = new StudentQuizService(studentQuizRepository, quizAttemptRepository, studentAnswerRepository);
    const studentQuizController = new StudentQuizController(studentQuizService);

    return studentQuizController;
}