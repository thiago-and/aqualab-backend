import { EntityManager } from "typeorm";
import { Student } from "../entities/Student";


export class StudentRepository {

    private manager: EntityManager;

    constructor(manager: EntityManager) {
        this.manager = manager;
    }

    createStudent = async (student: Student): Promise<Student> => {
        return this.manager.save(Student, student);
    }

    getAllStudents = async (): Promise<Student[]> => {
        return this.manager.find(Student, { relations: ['year', 'teacher'] });
    }

    getStudentById = async (id: string): Promise<Student | null> => {
        return this.manager.findOne(Student, { where: { id }, relations: ['year', 'teacher'] });
    }

    getStudentByEnrollmentNumber = async (enrollmentNumber: string): Promise<Student | null> => {
        return this.manager.findOne(Student, { where: { enrollmentNumber: parseInt(enrollmentNumber, 10) } });
    }

    updateStudent = async (id: string, updatedStudent: Partial<Student>): Promise<Student | null> => {
        const student = await this.manager.findOne(Student, { where: { id } });
        if (!student) {
            return null;
        }
        const updated = Object.assign(student, updatedStudent);
        return this.manager.save(Student, updated);
    }

    deleteStudent = async (id: string): Promise<void> => {
        await this.manager.delete(Student, id);
    }

}