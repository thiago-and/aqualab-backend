import { Router } from "express";
import { makeAuthController } from "../factories/AuthFactory";

export const authRoutes = Router();

const authController = makeAuthController();

authRoutes.post('/auth/teacher/login', authController.loginTeacher);
authRoutes.post('/auth/student/login', authController.loginStudent);