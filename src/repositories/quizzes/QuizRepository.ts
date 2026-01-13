import { EntityManager } from "typeorm";
import { Quiz } from "../../entities/quizzes/Quiz";
import { Question } from "../../entities/quizzes/Question";
import { Option } from "../../entities/quizzes/Option";
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
            relations: ["teacher", "year", "questions", "questions.options"]
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

    // Nuevo método para actualizar quiz con preguntas y opciones
    async updateQuizWithQuestions(
        quizId: string,
        title: string,
        year: any,
        questions: Array<{
            statement: string;
            options: Array<{ text: string; isCorrect: boolean }>;
        }>
    ): Promise<Quiz> {
        // 1. Eliminar todas las preguntas antiguas (cascada elimina opciones)
        await this.manager.delete(Question, { quiz: { id: quizId } });

        // 2. Actualizar el quiz básico
        const quiz = await this.getQuizById(quizId);
        if (!quiz) throw new Error("Quiz not found");

        quiz.title = title;
        quiz.year = year;
        
        // 3. Guardar quiz actualizado
        await this.manager.save(Quiz, quiz);

        // 4. Crear y guardar nuevas preguntas
        const newQuestions = questions.map(q => {
            const question = new Question();
            question.quiz = quiz;
            question.statement = q.statement;
            question.options = q.options.map(o => {
                const option = new Option();
                option.text = o.text;
                option.isCorrect = o.isCorrect;
                option.question = question;
                return option;
            });
            return question;
        });

        // Guardar todas las preguntas (con cascada se guardan las opciones)
        await this.manager.save(Question, newQuestions);

        // 5. Retornar el quiz actualizado con las nuevas preguntas
        return this.getQuizById(quizId) as Promise<Quiz>;
    }



}