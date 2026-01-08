import { QuizPublicDTO } from "../dtos/QuizPublicDTO";
import { Quiz } from "../entities/quizzes/Quiz";
import { QuizRepository } from "../repositories/QuizRepository";
import { TeacherRepository } from "../repositories/TeacherRepository";
import { YearRepository } from "../repositories/YearRepository";

export interface CreateQuizDTO {
    title: string;
    yearId: string;
    questions: {
        statement: string;
        options: {
            text: string;
            isCorrect: boolean;
        }[];
    }[];
}

export interface UpdateQuizDTO {
    title: string;
    yearId: string;
    questions: {
        statement: string;
        options: {
            text: string;
            isCorrect: boolean;
        }[];
    }[];
}

export interface QuizTeacherResponseDTO {
    id: string;
    title: string;
    year: {
        id: string;
        year: number;
    };
    questions: {
        id: string;
        statement: string;
        options: {
            id: string;
            text: string;
            isCorrect: boolean;
        }[];
    }[];
    createdAt: Date;
}

export class QuizService {

    private quizRepository: QuizRepository;
    private teacherRepository: TeacherRepository;
    private yearRepository: YearRepository;

    constructor(quizRepository: QuizRepository, teacherRepository: TeacherRepository, yearRepository: YearRepository) {
        this.quizRepository = quizRepository;
        this.teacherRepository = teacherRepository;
        this.yearRepository = yearRepository;
    }

    mapQuizToTeacherResponse(quiz: Quiz): QuizTeacherResponseDTO {
        return {
            id: quiz.id,
            title: quiz.title,
            year: {
                id: quiz.year.id,
                year: quiz.year.year
            },
            questions: quiz.questions.map(q => ({
                id: q.id,
                statement: q.statement,
                options: q.options.map(o => ({
                    id: o.id,
                    text: o.text,
                    isCorrect: o.isCorrect
                }))
            })),
            createdAt: quiz.createdAt
        };
    }


    createQuiz = async (
        data: CreateQuizDTO,
        teacherId: string
    ): Promise<Quiz> => {

        const teacher = await this.teacherRepository.getTeacherById(teacherId);
        if (!teacher) {
            throw new Error("Teacher not found.");
        }

        const year = await this.yearRepository.getYearById(data.yearId);
        if (!year) {
            throw new Error("Year not found.");
        }

        if (year.teacher.id !== teacher.id) {
            throw new Error(
                "You cannot create a quiz for a year that is not yours."
            );
        }

        data.questions.forEach(q => {
            if (q.options.filter(o => o.isCorrect).length !== 1) {
                throw new Error(
                    "Each question must have exactly one correct option."
                );
            }
        });

        const quiz = new Quiz();
        quiz.title = data.title;
        quiz.teacher = teacher;
        quiz.year = year;
        quiz.questions = data.questions.map(q => ({
            statement: q.statement,
            options: q.options.map(o => ({
                text: o.text,
                isCorrect: o.isCorrect
            }))
        })) as any;

        return await this.quizRepository.createQuiz(quiz);
    };


    deleteQuiz = async (
        quizId: string,
        teacherId: string
    ): Promise<void> => {

        const quiz = await this.quizRepository.getQuizById(quizId);

        if (!quiz) {
            throw new Error("Quiz not found.");
        }

        if (quiz.teacher.id !== teacherId) {
            throw new Error("You do not have permission to delete this quiz.");
        }

        await this.quizRepository.deleteQuizById(quizId);
    }

    getAllQuizzes = async (): Promise<Quiz[]> => {
        return this.quizRepository.getAllQuizzes();
    }

    getQuizById = async (
        quizId: string,
        user?: { id: string; role: "teacher" | "student" }
    ): Promise<Quiz | QuizPublicDTO> => {

        const quiz = await this.quizRepository.getQuizById(quizId);

        if (!quiz) {
            throw new Error("Quiz not found.");
        }

        if (user?.role === "teacher" && quiz.teacher.id === user.id) {
            return quiz;
        }

        return {
            id: quiz.id,
            title: quiz.title,
            questions: quiz.questions.map(q => ({
                id: q.id,
                statement: q.statement,
                options: q.options.map(o => ({
                    id: o.id,
                    text: o.text
                }))
            }))
        };
    };

    getQuizzesByTeacherId = async (teacherId: string): Promise<Quiz[]> => {
        return this.quizRepository.getQuizzesByTeacherId(teacherId);
    }

    updateQuiz = async (
        quizId: string,
        data: UpdateQuizDTO,
        teacherId: string
    ): Promise<Quiz> => {

        const quiz = await this.quizRepository.getQuizById(quizId);
        if (!quiz) {
            throw new Error("Quiz not found.");
        }

        if (quiz.teacher.id !== teacherId) {
            throw new Error("You do not have permission to edit this quiz.");
        }

        const year = await this.yearRepository.getYearById(data.yearId);
        if (!year) {
            throw new Error("Year not found.");
        }

        if (year.teacher.id !== teacherId) {
            throw new Error(
                "You cannot move this quiz to a year that is not yours."
            );
        }

        data.questions.forEach(q => {
            if (q.options.filter(o => o.isCorrect).length !== 1) {
                throw new Error(
                    "Each question must have exactly one correct option."
                );
            }
        });

        quiz.title = data.title;
        quiz.year = year;
        quiz.questions = data.questions.map(q => ({
            statement: q.statement,
            options: q.options.map(o => ({
                text: o.text,
                isCorrect: o.isCorrect
            }))
        })) as any;

        return await this.quizRepository.updateQuiz(quiz);
    };


}
