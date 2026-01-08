import { Teacher } from "../entities/users/Teacher";
import { TeacherRepository } from "../repositories/TeacherRepository";
import bcrypt from "bcryptjs";


export class TeacherService {

    private teacherRepository: TeacherRepository;

    constructor(teacherRepository: TeacherRepository) {
        this.teacherRepository = teacherRepository;
    }

    createTeacher = async (teacherData: Partial<Teacher>): Promise<Teacher> => {
        teacherData.password = await bcrypt.hash(teacherData.password as string, 10);
        const teacher = await this.teacherRepository.createTeacher(teacherData as Teacher);
        return teacher;
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