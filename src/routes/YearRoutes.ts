import { Router } from "express";
import { makeYearController } from "../factories/YearFactory";
import { authMiddleware } from "../middlewares/AuthMiddleware";
import { ensureTeacher } from "../middlewares/EnsureTeacher";

export const yearRoutes = Router();

const yearController = makeYearController();

yearRoutes.post('/years', authMiddleware, ensureTeacher, yearController.createYear);
yearRoutes.get('/years', authMiddleware, ensureTeacher, yearController.getAllYears);
yearRoutes.get('/years/:id',authMiddleware, ensureTeacher, yearController.getYearByYear);
yearRoutes.put('/years/:id', authMiddleware, ensureTeacher, yearController.updateYear);
yearRoutes.delete('/years/:id', authMiddleware, ensureTeacher, yearController.deleteYear);
