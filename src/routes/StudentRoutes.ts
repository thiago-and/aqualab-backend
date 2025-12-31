import { Router } from "express";
import { makeStudentController } from "../factories/StudentFactory";


export const studentRoutes = Router();

const StudentController = makeStudentController();

studentRoutes.post('/students', StudentController.createStudent);
studentRoutes.get('/students', StudentController.getAllStudents);
studentRoutes.get('/students/:id', StudentController.getStudentById);
studentRoutes.put('/students/:id', StudentController.updateStudent);
studentRoutes.delete('/students/:id', StudentController.deleteStudent);