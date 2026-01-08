import { EntityManager } from "typeorm";
import { StudentAnswer } from "../../entities/quizzes/StudentAnswer";

export class StudentAnswerRepository {
    private manager: EntityManager;

    constructor(manager: EntityManager) {
        this.manager = manager;
    }

    saveMany(answers: StudentAnswer[]) {
        return this.manager.save(answers);
    }

    findByAttempt(attemptId: string) {
        return this.manager.find(StudentAnswer, {
            where: {
                attempt: { id: attemptId }
            },
            relations: ["question", "selectedOption"]
        });
    }
}
