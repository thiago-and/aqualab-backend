import { EntityManager } from "typeorm";
import { Teacher } from "../entities/users/Teacher";


export class TeacherRepository {

    private manager: EntityManager;

    constructor(manager: EntityManager) {
        this.manager = manager;
    }

    createTeacher = async (teacher: Teacher): Promise<Teacher> => {
        return this.manager.save(Teacher, teacher);
    }

    getAllTeachers = async (): Promise<Teacher[]> => {
        return this.manager.find(Teacher);
    }

    getTeacherById = async (id: string): Promise<Teacher | null> => {
        return this.manager.findOne(Teacher, { where: { id } });
    }

    getTeacherByEmail = async (email: string): Promise<Teacher | null> => {
        return this.manager.findOne(Teacher, { where: { email } });
    }

    updateTeacher = async (id: string, updatedTeacherData: Partial<Teacher>): Promise<Teacher | null> => {
        const teacher = await this.getTeacherById(id);
        if (!teacher) {
            return null;
        }
        Object.assign(teacher, updatedTeacherData);
        return this.manager.save(Teacher, teacher);
    }

    deleteTeacher = async (id: string): Promise<void> => {
        await this.manager.delete(Teacher, id);
    }

}