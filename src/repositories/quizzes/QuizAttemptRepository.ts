import { EntityManager } from "typeorm";
import { QuizAttempt, QuizAttemptStatus } from "../../entities/quizzes/QuizAttempt";

export class QuizAttemptRepository {
    private manager: EntityManager;

    constructor(manager: EntityManager) {
        this.manager = manager;
    }

    findById(attemptId: string) {
        return this.manager.findOne(QuizAttempt, {
            where: { id: attemptId },
            relations: ["quiz", "answers", "student", "quiz.questions", "quiz.questions.options"]
        });
    }

    findWithQuiz(attemptId: string) {
            return this.manager.findOne(QuizAttempt, {
            where: { id: attemptId },
            relations: ["quiz", "student"]
        });
    }

    async findInProgress(attemptId: string) {
        return await this.manager.findOne(QuizAttempt, {
            where: { id: attemptId },
            relations: ["quiz", "student"]
        });
    }

    finish(attemptId: string, score: number) {
        return this.manager.update(QuizAttempt, attemptId, {
            status: QuizAttemptStatus.FINISHED,
            score
        });
    }

    delete(attemptId: string) {
        return this.manager.delete(QuizAttempt, attemptId);
    }
}
