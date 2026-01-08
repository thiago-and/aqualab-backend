import { Router } from 'express';
import { makeTeacherController } from '../factories/TeacherFactory';

export const teacherRoutes = Router();

const teacherController = makeTeacherController();

teacherRoutes.post('/teachers', teacherController.createTeacher);
teacherRoutes.get('/teachers', teacherController.getAllTeachers);
teacherRoutes.get('/teachers/:id', teacherController.getTeacherById);
teacherRoutes.put('/teachers/:id', teacherController.updateTeacher);
teacherRoutes.delete('/teachers/:id', teacherController.deleteTeacher);