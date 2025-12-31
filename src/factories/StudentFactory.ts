import { StudentController } from "../controllers/StudentController";
import { AppDataSource } from "../database/data-source";
import { StudentRepository } from "../repositories/StudendRepository";
import { YearRepository } from "../repositories/YearRepository";
import { StudentService } from "../services/StudentService";


export function makeStudentController() {

    const manager = AppDataSource.manager;
    const studentRepository = new StudentRepository(manager);
    const yearRepository = new YearRepository(manager);
    const studentService = new StudentService(studentRepository, yearRepository);
    const studentController = new StudentController(studentService);

    return studentController;
}