import { Teacher } from "../entities/users/Teacher";
import { TeacherRepository } from "../repositories/TeacherRepository";
import bcrypt from "bcryptjs";


export class TeacherService {

    private teacherRepository: TeacherRepository;

    constructor(teacherRepository: TeacherRepository) {
        this.teacherRepository = teacherRepository;
    }

    createTeacher = async (teacherData: Partial<Teacher>): Promise<Teacher> => {
        const enrollmentNumber = teacherData.enrollmentNumber as number;
        const email = teacherData.email as string;

        const existingByEnrollment = await this.teacherRepository.getTeacherByEnrollmentNumber(enrollmentNumber);
        if (existingByEnrollment) {
            throw new Error("Enrollment number already in use");
        }

        const existingByEmail = await this.teacherRepository.getTeacherByEmail(email);
        if (existingByEmail) {
            throw new Error("Email already in use");
        }

        const teacher = new Teacher();
        teacher.name = teacherData.name as string;
        teacher.enrollmentNumber = enrollmentNumber;
        teacher.email = email;
        teacher.password = await bcrypt.hash(teacherData.password as string, 10);

        return this.teacherRepository.createTeacher(teacher);
    }

    getAllTeachers = async (): Promise<Teacher[]> => {
        return this.teacherRepository.getAllTeachers();
    }

    getTeacherById = async (id: string): Promise<Teacher | null> => {
        return this.teacherRepository.getTeacherById(id);
    }

    updateTeacher = async (id: string, updatedTeacherData: Partial<Teacher>): Promise<Teacher | null> => {
        return this.teacherRepository.updateTeacher(id, updatedTeacherData);
    }

    deleteTeacher = async (id: string): Promise<void> => {
        return this.teacherRepository.deleteTeacher(id);
    }

}