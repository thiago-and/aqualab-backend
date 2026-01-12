import { Router } from "express";
import { makeQuizAttemptController } from "../../factories/QuizAttemptFactory";
import { ensureAuthenticated } from "../../middlewares/ensureAuthenticated";
import { ensureStudent } from "../../middlewares/ensureStudent";
import { ensureTeacher } from "../../middlewares/ensureTeacher";

export const quizAttemptRoutes = Router();

const controller = makeQuizAttemptController();

quizAttemptRoutes.get(
  "/quiz-attempts",
  ensureAuthenticated,
  ensureStudent,
  controller.listMine
);

quizAttemptRoutes.get(
  "/quiz-attempts/:attemptId",
  ensureAuthenticated,
  ensureStudent,
  controller.getOne
);

quizAttemptRoutes.post(
  "/quiz-attempts",
  ensureAuthenticated,
  ensureStudent,
  controller.create
);

quizAttemptRoutes.put(
  "/quiz-attempts/:attemptId",
  ensureAuthenticated,
  ensureStudent,
  controller.update
);

quizAttemptRoutes.get(
  "/students/:studentId/results",
  ensureAuthenticated,
  ensureTeacher,
  controller.getStudentResults
);
