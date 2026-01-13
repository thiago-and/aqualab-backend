import { EntityManager } from "typeorm";
import { Quiz } from "../../entities/quizzes/Quiz";
import { QuizAttempt, QuizAttemptStatus } from "../../entities/quizzes/QuizAttempt";
import { StudentAnswer } from "../../entities/quizzes/StudentAnswer";
import { Student } from "../../entities/users/Student";
import { QuizAttemptRepository } from "../../repositories/quizzes/QuizAttemptRepository";
import { StudentAnswerRepository } from "../../repositories/quizzes/StudentAnswerRepository";

export type SubmitAttemptDTO = {
  quizId: string;
  attemptId: string;
  score?: number;
  totalPoints?: number;
  totalQuestions?: number;
  correctAnswers?: number;
  incorrectAnswers?: number;
  answers: Array<{
    questionId: string;
    optionId: string;
    isCorrect?: boolean;
  }>;
};

export class QuizAttemptService {
  private attemptRepo: QuizAttemptRepository;
  private answerRepo: StudentAnswerRepository;
  private manager: EntityManager;

  constructor(
    manager: EntityManager,
    attemptRepo: QuizAttemptRepository,
    answerRepo: StudentAnswerRepository
  ) {
    this.manager = manager;
    this.attemptRepo = attemptRepo;
    this.answerRepo = answerRepo;
  }

  async submitResult(studentId: string, payload: SubmitAttemptDTO) {
    const attempt = await this.attemptRepo.findById(payload.attemptId);

    if (!attempt) throw new Error("Invalid attempt ID");
    if (attempt.student.id !== studentId)
      throw new Error("Attempt does not belong to the student");
    if (attempt.quiz.id !== payload.quizId)
      throw new Error("Attempt does not belong to this quiz");
    if (attempt.status !== QuizAttemptStatus.IN_PROGRESS)
      throw new Error("Attempt already finished");

    const scoring = this.evaluateAnswers(attempt.quiz, payload.answers);

    await this.answerRepo.saveMany(
      payload.answers.map(a =>
        Object.assign(new StudentAnswer(), {
          attempt: { id: attempt.id },
          question: { id: a.questionId },
          selectedOption: { id: a.optionId }
        })
      )
    );

    await this.attemptRepo.finish(attempt.id, {
      score: scoring.percentage,
      totalPoints: scoring.totalPoints,
      totalQuestions: scoring.totalQuestions,
      correctAnswers: scoring.correctAnswers,
      incorrectAnswers: scoring.incorrectAnswers,
      percentage: scoring.percentage,
      submittedAt: new Date(),
      quizTitle: attempt.quiz.title,
      answersPayload: scoring.answersPayload
    });

    const updated = await this.attemptRepo.findByIdAndStudent(
      attempt.id,
      studentId
    );

    return {
      success: true,
      data: this.buildAttemptResponse(updated!)
    };
  }

  async updateAttempt(studentId: string, attemptId: string, payload: SubmitAttemptDTO) {
    const attempt = await this.attemptRepo.findByIdAndStudent(attemptId, studentId);

    if (!attempt) throw new Error("Attempt not found");
    if (attempt.quiz.id !== payload.quizId)
      throw new Error("Attempt does not belong to this quiz");

    const scoring = this.evaluateAnswers(attempt.quiz, payload.answers);

    await this.answerRepo.replaceForAttempt(
      attempt.id,
      payload.answers.map(a =>
        Object.assign(new StudentAnswer(), {
          attempt: { id: attempt.id },
          question: { id: a.questionId },
          selectedOption: { id: a.optionId }
        })
      )
    );

    await this.attemptRepo.finish(attempt.id, {
      score: scoring.percentage,
      totalPoints: scoring.totalPoints,
      totalQuestions: scoring.totalQuestions,
      correctAnswers: scoring.correctAnswers,
      incorrectAnswers: scoring.incorrectAnswers,
      percentage: scoring.percentage,
      submittedAt: attempt.submittedAt ?? new Date(),
      quizTitle: attempt.quiz.title,
      answersPayload: scoring.answersPayload
    });

    const updated = await this.attemptRepo.findByIdAndStudent(
      attempt.id,
      studentId
    );

    return {
      success: true,
      data: this.buildAttemptResponse(updated!)
    };
  }

  async getStudentAttempts(studentId: string) {
    const attempts = await this.attemptRepo.findByStudent(studentId);

    return {
      success: true,
      data: attempts.map(a => this.buildAttemptResponse(a))
    };
  }

  async getAttemptDetail(studentId: string, attemptId: string) {
    const attempt = await this.attemptRepo.findByIdAndStudent(
      attemptId,
      studentId
    );

    if (!attempt) throw new Error("Attempt not found");

    return {
      success: true,
      data: this.buildAttemptResponse(attempt, true)
    };
  }

  async getStudentResultsForTeacher(studentId: string, teacherId: string) {
    const student = await this.manager.findOne(Student, {
      where: { id: studentId },
      relations: ["year", "year.teacher", "teacher"]
    });

    if (!student) throw new Error("Student not found");

    const isOwner =
      student.teacher?.id === teacherId || student.year?.teacher?.id === teacherId;

    if (!isOwner) {
      throw new Error("You are not allowed to view this student's results");
    }

    const attempts = await this.attemptRepo.findByStudent(studentId);
    const finishedAttempts = attempts.filter(
      a => a.status === QuizAttemptStatus.FINISHED
    );

    const stats = this.buildStats(finishedAttempts);

    return {
      attempts: finishedAttempts.map(a => ({
        id: a.id,
        quizTitle: a.quizTitle ?? a.quiz.title,
        score: a.score,
        totalPoints: a.totalPoints,
        percentage: a.percentage,
        correctAnswers: a.correctAnswers,
        totalQuestions: a.totalQuestions,
        submittedAt: a.submittedAt ?? a.createdAt,
        status: a.status
      })),
      stats: {
        averageScore: stats.averageScore,
        totalAttempts: stats.totalCompleted,
        passedQuizzes: finishedAttempts.filter(a => (a.percentage || 0) >= 60).length
      }
    };
  }

  private evaluateAnswers(quiz: Quiz, answers: SubmitAttemptDTO["answers"]) {
    if (answers.length !== quiz.questions.length)
      throw new Error("All questions must be answered");

    const answersPayload: Array<{
      questionId: string;
      optionId: string;
      isCorrect: boolean;
    }> = [];

    for (const answer of answers) {
      const question = quiz.questions.find(q => q.id === answer.questionId);
      if (!question) throw new Error("Invalid question ID");

      const selectedOption = question.options.find(o => o.id === answer.optionId);
      if (!selectedOption) throw new Error("Invalid option ID");

      const isCorrect = selectedOption.isCorrect;
      answersPayload.push({
        questionId: question.id,
        optionId: selectedOption.id,
        isCorrect
      });
    }

    const correctAnswers = answersPayload.filter(a => a.isCorrect).length;
    const totalQuestions = answersPayload.length;
    const incorrectAnswers = totalQuestions - correctAnswers;
    const totalPoints = 100;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);

    return {
      answersPayload,
      correctAnswers,
      incorrectAnswers,
      totalQuestions,
      totalPoints,
      percentage
    };
  }

  private buildAttemptResponse(attempt: QuizAttempt, includeAnswers = false) {
    return {
      id: attempt.id,
      studentId: attempt.student.id,
      quizId: attempt.quiz.id,
      quizTitle: attempt.quizTitle ?? attempt.quiz.title,
      score: attempt.score,
      totalPoints: attempt.totalPoints,
      totalQuestions: attempt.totalQuestions,
      correctAnswers: attempt.correctAnswers,
      incorrectAnswers: attempt.incorrectAnswers,
      percentage: attempt.percentage,
      submittedAt: attempt.submittedAt ?? attempt.createdAt,
      status:
        attempt.status === QuizAttemptStatus.FINISHED ? "completed" : "in_progress",
      answers: includeAnswers
        ? this.getAnswersPayload(attempt)
        : undefined
    };
  }

  private getAnswersPayload(attempt: QuizAttempt) {
    if (attempt.answersPayload && attempt.answersPayload.length > 0) {
      return attempt.answersPayload;
    }

    if (!attempt.answers || attempt.answers.length === 0) return [];

    return attempt.answers.map(a => ({
      questionId: a.question.id,
      optionId: a.selectedOption.id,
      isCorrect: a.selectedOption.isCorrect
    }));
  }

  private buildStats(attempts: QuizAttempt[]) {
    if (attempts.length === 0) {
      return {
        totalCompleted: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0
      };
    }

    const scores = attempts.map(a => a.percentage || a.score);
    const totalCompleted = attempts.length;
    const sum = scores.reduce((acc, cur) => acc + cur, 0);

    return {
      totalCompleted,
      averageScore: Math.round((sum / totalCompleted) * 100) / 100,
      highestScore: Math.max(...scores),
      lowestScore: Math.min(...scores)
    };
  }
}
