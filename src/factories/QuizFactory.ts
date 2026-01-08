import { QuizController } from "../controllers/quizzes/QuizController";
import { AppDataSource } from "../database/data-source";
import { QuizRepository } from "../repositories/quizzes/QuizRepository";
import { TeacherRepository } from "../repositories/TeacherRepository";
import { YearRepository } from "../repositories/YearRepository";
import { QuizService } from "../services/quizzes/QuizService";


export function makeQuizController() {

    const manager = AppDataSource.manager;
    const quizRepository = new QuizRepository(manager);
    const teacherRepository = new TeacherRepository(manager);
    const yearRepository = new YearRepository(manager);
    const quizService = new QuizService(quizRepository, teacherRepository, yearRepository);
    const quizController = new QuizController(quizService);

    return quizController;
}