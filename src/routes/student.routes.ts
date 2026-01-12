import { Router } from "express";
import { makeStudentController } from "../factories/StudentFactory";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

export const studentRoutes = Router();

const StudentController = makeStudentController();

studentRoutes.post('/students', StudentController.createStudent);
studentRoutes.get('/students', ensureAuthenticated, StudentController.getAllStudents);
studentRoutes.get('/students/:id', ensureAuthenticated, StudentController.getStudentById);
studentRoutes.put('/students/:id', ensureAuthenticated, StudentController.updateStudent);
studentRoutes.delete('/students/:id', ensureAuthenticated, StudentController.deleteStudent);