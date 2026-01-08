import { AppDataSource } from "../database/data-source";
import { YearRepository } from "../repositories/YearRepository";
import { YearService } from "../services/YearService";
import { YearController } from "../controllers/YearController";
import { TeacherRepository } from "../repositories/TeacherRepository";

export function makeYearController(): YearController {
    const manager = AppDataSource.manager;
    const yearRepository = new YearRepository(manager);
    const teacherRepository = new TeacherRepository(manager);
    const yearService = new YearService(yearRepository, teacherRepository);
    const yearController = new YearController(yearService);

    return yearController;
}
