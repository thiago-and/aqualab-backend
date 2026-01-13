import { Request, Response } from "express";
import { QuizAttemptService, SubmitAttemptDTO } from "../../services/quizzes/QuizAttemptService";

export class QuizAttemptController {
  private service: QuizAttemptService;

  constructor(service: QuizAttemptService) {
    this.service = service;
  }

  listMine = async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });

    try {
      const result = await this.service.getStudentAttempts(req.user.id);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  };

  getOne = async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });

    try {
      const result = await this.service.getAttemptDetail(
        req.user.id,
        req.params.attemptId
      );
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(404).json({ message: error.message });
    }
  };

  create = async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });

    try {
      const payload = req.body as SubmitAttemptDTO;
      const result = await this.service.submitResult(req.user.id, payload);
      return res.status(201).json(result);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  };

  update = async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });

    try {
      const payload = req.body as SubmitAttemptDTO;
      const result = await this.service.updateAttempt(
        req.user.id,
        req.params.attemptId,
        payload
      );
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  };

  getStudentResults = async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });

    try {
      const result = await this.service.getStudentResultsForTeacher(
        req.params.studentId,
        req.user.id
      );
      return res.status(200).json(result);
    } catch (error: any) {
      const status = error.message.includes("not allowed") ? 403 : 400;
      return res.status(status).json({ message: error.message });
    }
  };
}
