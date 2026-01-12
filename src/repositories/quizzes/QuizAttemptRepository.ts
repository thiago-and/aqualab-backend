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
            relations: [
                "quiz",
                "answers",
                "student",
                "quiz.questions",
                "quiz.questions.options"
            ]
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

    finish(attemptId: string, data: number | Partial<QuizAttempt>) {
        const payload =
            typeof data === "number"
                ? { score: data }
                : data;

        return this.manager.update(QuizAttempt, attemptId, {
            status: QuizAttemptStatus.FINISHED,
            ...payload
        });
    }

    delete(attemptId: string) {
        return this.manager.delete(QuizAttempt, attemptId);
    }

    findByStudent(studentId: string) {
        return this.manager.find(QuizAttempt, {
            where: { student: { id: studentId } },
            relations: ["quiz", "student"],
            order: {
                submittedAt: "DESC",
                createdAt: "DESC"
            }
        });
    }

    findByIdAndStudent(attemptId: string, studentId: string) {
        return this.manager.findOne(QuizAttempt, {
            where: { id: attemptId, student: { id: studentId } },
            relations: [
                "quiz",
                "student",
                "quiz.questions",
                "quiz.questions.options",
                "answers"
            ]
        });
    }
}
