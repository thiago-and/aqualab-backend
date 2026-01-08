import { EntityManager } from "typeorm";
import { QuizAttempt, QuizAttemptStatus } from "../../entities/quizzes/QuizAttempt";

export class StudentQuizRepository {
  private manager: EntityManager;

  constructor(manager: EntityManager) {
    this.manager = manager;
  }

  findFinishedAttempt(studentId: string, quizId: string) {
    return this.manager.findOne(QuizAttempt, {
      where: {
        student: { id: studentId },
        quiz: { id: quizId },
        status: QuizAttemptStatus.FINISHED
      }
    });
  }

  findInProgressAttempt(studentId: string, quizId: string) {
    return this.manager.findOne(QuizAttempt, {
      where: {
        student: { id: studentId },
        quiz: { id: quizId },
        status: QuizAttemptStatus.IN_PROGRESS
      }
    });
  }

  createAttempt(studentId: string, quizId: string) {
    const attempt = this.manager.create(QuizAttempt, {
      student: { id: studentId },
      quiz: { id: quizId }
    });

    return this.manager.save(attempt);
  }

  finishAttempt(attemptId: string, score: number) {
    return this.manager.update(QuizAttempt, attemptId, {
      status: QuizAttemptStatus.FINISHED,
      score
    });
  }
}
