import { AppDataSource } from "../database/data-source";
import { TeacherRepository } from "../repositories/TeacherRepository";
import { TeacherService } from "../services/TeacherService";
import { TeacherController } from "../controllers/TeacherController";

export function makeTeacherController(): TeacherController {
    const manager = AppDataSource.manager;
    const teacherRepository = new TeacherRepository(manager);
    const teacherService = new TeacherService(teacherRepository);
    const teacherController = new TeacherController(teacherService);

    return teacherController;
}