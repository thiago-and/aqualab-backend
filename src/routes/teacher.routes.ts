import { Router } from 'express';
import { makeTeacherController } from '../factories/TeacherFactory';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';

export const teacherRoutes = Router();

const teacherController = makeTeacherController();

teacherRoutes.post('/teachers', teacherController.createTeacher);
teacherRoutes.get('/teachers', ensureAuthenticated, teacherController.getAllTeachers);
teacherRoutes.get('/teachers/:id', ensureAuthenticated, teacherController.getTeacherById);
teacherRoutes.put('/teachers/:id', ensureAuthenticated, teacherController.updateTeacher);
teacherRoutes.delete('/teachers/:id', ensureAuthenticated, teacherController.deleteTeacher);