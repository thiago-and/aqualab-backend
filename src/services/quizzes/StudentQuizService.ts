import { Quiz } from "../../entities/quizzes/Quiz";
import { QuizAttempt, QuizAttemptStatus } from "../../entities/quizzes/QuizAttempt";
import { StudentAnswer } from "../../entities/quizzes/StudentAnswer";
import { QuizAttemptRepository } from "../../repositories/quizzes/QuizAttemptRepository";
import { StudentAnswerRepository } from "../../repositories/quizzes/StudentAnswerRepository";
import { StudentQuizRepository } from "../../repositories/quizzes/StudentQuizRepository";

type AnswerDTO = {
    questionId: string;
    optionId: string;
};

type QuestionResultDTO = {
    questionId: string;
    selectedOptionId: string;
    correctOptionId: string;
    isCorrect: boolean;
};

type SubmitQuizResultDTO = {
    score: number;
    results: QuestionResultDTO[];
};


export class StudentQuizService {

    private studentQuizRepository: StudentQuizRepository;
    private attemptRepo: QuizAttemptRepository;
    private answerRepo: StudentAnswerRepository;

    constructor(
        studentQuizRepository: StudentQuizRepository,
        attemptRepo: QuizAttemptRepository,
        answerRepo: StudentAnswerRepository
    ) {
        this.studentQuizRepository = studentQuizRepository;
        this.attemptRepo = attemptRepo;
        this.answerRepo = answerRepo;
    }

    async startQuiz(studentId: string, quizId: string) {
        // Regra 1: não pode responder novamente
        const finishedAttempt =
            await this.studentQuizRepository.findFinishedAttempt(studentId, quizId);

        if (finishedAttempt) {
            throw new Error("Quiz already completed.");
        }

        // Regra 2: reutiliza tentativa em andamento
        const inProgressAttempt =
            await this.studentQuizRepository.findInProgressAttempt(studentId, quizId);

        if (inProgressAttempt) {
            return inProgressAttempt;
        }

        // Regra 3: cria nova tentativa
        return this.studentQuizRepository.createAttempt(studentId, quizId);
    }

    async submitQuiz(
        studentId: string,
        attemptId: string,
        answers: AnswerDTO[]
    ): Promise<SubmitQuizResultDTO> {

        const attempt = await this.attemptRepo.findById(attemptId);

        if (!attempt) throw new Error("Invalid attempt ID");
        if (attempt.student.id !== studentId)
            throw new Error("Attempt does not belong to the student");
        if (attempt.status !== QuizAttemptStatus.IN_PROGRESS)
            throw new Error("Attempt already finished");

        const existing = await this.answerRepo.findByAttempt(attemptId);
        if (existing.length > 0)
            throw new Error("Attempt already submitted");

        if (answers.length !== attempt.quiz.questions.length)
            throw new Error("All questions must be answered");

        const results: QuestionResultDTO[] = [];

        // valida + calcula resultados
        for (const answer of answers) {
            const question = attempt.quiz.questions.find(
                q => q.id === answer.questionId
            );
            if (!question) throw new Error("Invalid question ID");

            const selectedOption = question.options.find(
                o => o.id === answer.optionId
            );
            if (!selectedOption) throw new Error("Invalid option ID");

            const correctOption = question.options.find(o => o.isCorrect);
            if (!correctOption)
                throw new Error("Question has no correct option configured");

            results.push({
                questionId: question.id,
                selectedOptionId: selectedOption.id,
                correctOptionId: correctOption.id,
                isCorrect: selectedOption.isCorrect
            });
        }

        // salvar respostas
        await this.answerRepo.saveMany(
            answers.map(a =>
                Object.assign(new StudentAnswer(), {
                    attempt: { id: attemptId },
                    question: { id: a.questionId },
                    selectedOption: { id: a.optionId }
                })
            )
        );

        // calcular nota
        const correctCount = results.filter(r => r.isCorrect).length;
        const score = Math.round((correctCount / results.length) * 100);

        await this.attemptRepo.finish(attemptId, score);

        return {
            score,
            results
        };
    }

    async deleteAttempt(studentId: string, attemptId: string) {
        const attempt = await this.attemptRepo.findById(attemptId);

        if (!attempt) {
            throw new Error("Attempt not found.");
        }

        if (attempt.student.id !== studentId) {
            throw new Error("Attempt does not belong to the student");
        }

        if (attempt.status !== QuizAttemptStatus.IN_PROGRESS) {
            throw new Error("Finished attempt cannot be deleted");
        }

        await this.attemptRepo.delete(attemptId);
    }

    calculateScore(
        quiz: Quiz,
        answers: AnswerDTO[]
    ): number {
        const totalQuestions = quiz.questions.length;
        const pointsPerQuestion = 100 / totalQuestions;
        let score = 0;

        for (const answer of answers) {
            const question = quiz.questions.find(q => q.id === answer.questionId)!;
            const option = question.options.find(o => o.id === answer.optionId)!;

            if (option.isCorrect) {
                score += pointsPerQuestion;
            }
        }

        return Math.round(score * 100) / 100;
    }

}