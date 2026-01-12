import { Router } from "express";
import { makeYearController } from "../factories/YearFactory";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureTeacher } from "../middlewares/EnsureTeacher";

export const yearRoutes = Router();

const yearController = makeYearController();

yearRoutes.post('/years', ensureAuthenticated, ensureTeacher, yearController.createYear);
yearRoutes.get('/years', ensureAuthenticated, ensureTeacher, yearController.getAllYears);
yearRoutes.get('/years/:id',ensureAuthenticated, ensureTeacher, yearController.getYearByYear);
yearRoutes.put('/years/:id', ensureAuthenticated, ensureTeacher, yearController.updateYear);
yearRoutes.delete('/years/:id', ensureAuthenticated, ensureTeacher, yearController.deleteYear);
