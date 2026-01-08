import { Router } from "express";
import { makeStudentQuizController } from "../../factories/StudentQuizFactory";
import { ensureAuthenticated } from "../../middlewares/ensureAuthenticated";
import { ensureStudent } from "../../middlewares/ensureStudent";

export const studentQuizRoutes = Router();
const StudentQuizController = makeStudentQuizController();

studentQuizRoutes.post(
  "/quizzes/:quizId/start",
  ensureAuthenticated,
  ensureStudent,
  StudentQuizController.start
);

studentQuizRoutes.post(
  "/quiz-attempts/:attemptId/submit",
  ensureAuthenticated,
  ensureStudent,
  StudentQuizController.submit
);

studentQuizRoutes.delete(
  "/quiz-attempts/:attemptId",
  ensureAuthenticated,
  ensureStudent,
  StudentQuizController.deleteAttempt
);
