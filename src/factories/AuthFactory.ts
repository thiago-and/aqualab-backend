import { AppDataSource } from "../database/data-source";
import { AuthController } from "../controllers/AuthController";
import { AuthService } from "../services/AuthService";
import { TeacherRepository } from "../repositories/TeacherRepository";
import { StudentRepository } from "../repositories/StudendRepository";

export function makeAuthController(): AuthController {
    const manager = AppDataSource.manager;

    const teacherRepository = new TeacherRepository(manager);
    const studentRepository = new StudentRepository(manager);

    const authService = new AuthService(
        teacherRepository,
        studentRepository
    );

    const authController = new AuthController(authService);

    return authController;
}
