import { EntityManager } from "typeorm";
import { Quiz } from "../../entities/quizzes/Quiz";
import { QuizAttemptStatus } from "../../entities/quizzes/QuizAttempt";

export class QuizRepository {

    private manager: EntityManager;

    constructor(manager: EntityManager) {
        this.manager = manager;
    }

    createQuiz = async (quiz: Quiz,): Promise<Quiz> => {
        return this.manager.save(Quiz, quiz);
    }

    deleteQuizById = async (quizId: string): Promise<void> => {
        await this.manager.delete(Quiz, quizId);
    }

    async findAvailableForStudent(studentId: string) {
        return this.manager
            .createQueryBuilder(Quiz, "quiz")
            .leftJoin(
                "quiz.attempts",
                "attempt",
                "attempt.studentId = :studentId AND attempt.status = :status",
                {
                    studentId,
                    status: QuizAttemptStatus.FINISHED
                }
            )
            .where("attempt.id IS NULL")
            .getMany();
    }

    getQuizById = async (quizId: string): Promise<Quiz | null> => {
        return this.manager.findOne(Quiz, {
            where: { id: quizId },
            relations: ["teacher", "questions", "questions.options"]
        });
    };

    getAllQuizzes = async (): Promise<Quiz[]> => {
        return this.manager.find(Quiz, {
            relations: ["teacher"]
        });
    }

    getQuizzesByTeacherId = async (teacherId: string): Promise<Quiz[]> => {
        return this.manager.find(Quiz, {
            where: { teacher: { id: teacherId } },
            relations: ["teacher"]
        });
    }

    updateQuiz = async (quiz: Quiz): Promise<Quiz> => {
        return this.manager.save(Quiz, quiz);
    }



}