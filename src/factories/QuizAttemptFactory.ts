import { QuizAttemptController } from "../controllers/quizzes/QuizAttemptController";
import { AppDataSource } from "../database/data-source";
import { QuizAttemptRepository } from "../repositories/quizzes/QuizAttemptRepository";
import { StudentAnswerRepository } from "../repositories/quizzes/StudentAnswerRepository";
import { QuizAttemptService } from "../services/quizzes/QuizAttemptService";

export function makeQuizAttemptController() {
  const manager = AppDataSource.manager;
  const attemptRepo = new QuizAttemptRepository(manager);
  const answerRepo = new StudentAnswerRepository(manager);
  const service = new QuizAttemptService(manager, attemptRepo, answerRepo);

  return new QuizAttemptController(service);
}
