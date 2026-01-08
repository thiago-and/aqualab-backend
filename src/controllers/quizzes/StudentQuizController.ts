// src/controllers/quizzes/StudentQuizController.ts
import { Request, Response } from "express";
import { StudentQuizService } from "../../services/quizzes/StudentQuizService";

export class StudentQuizController {
  private studentQuizService: StudentQuizService;

  constructor(studentQuizService: StudentQuizService) {
    this.studentQuizService = studentQuizService;
  }

  start = async (req: Request, res: Response) => {
    const studentId = req.user!.id;
    const { quizId } = req.params;

    try {
      const attempt = await this.studentQuizService.startQuiz(studentId, quizId);
      return res.status(200).json(attempt);
    } catch (error: any) {
      return res.status(400).json({
        message: error.message
      });
    }
  };

  submit = async (req: Request, res: Response) => {
    const studentId = req.user!.id;
    const { attemptId } = req.params;
    const { answers } = req.body;

    try {
      const result = await this.studentQuizService.submitQuiz(
        studentId,
        attemptId,
        answers
      );

      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  };


  deleteAttempt = async (req: Request, res: Response) => {
    const { attemptId } = req.params;
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const studentId = req.user.id

    try {
      await this.studentQuizService.deleteAttempt(studentId, attemptId);
      return res.status(204).send();
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  };

}