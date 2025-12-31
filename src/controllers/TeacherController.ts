import { TeacherService } from "../services/TeacherService";


export class TeacherController {

    private teacherService: TeacherService;

    constructor(teacherService: TeacherService) {
        this.teacherService = teacherService;
    }
    createTeacher = async (req: any, res: any): Promise<void> => {
        const teacherData = req.body;
        const newTeacher = await this.teacherService.createTeacher(teacherData);
        res.status(201).json(newTeacher);
    }

    getAllTeachers = async (req: any, res: any): Promise<void> => {
        const teachers = await this.teacherService.getAllTeachers();
        res.status(200).json(teachers);
    }

    getTeacherById = async (req: any, res: any): Promise<void> => {
        const id = req.params.id;
        const teacher = await this.teacherService.getTeacherById(id);
        if (teacher) {
            res.status(200).json(teacher);
        } else {
            res.status(404).json({ message: "Teacher not found" });
        }
    }

    updateTeacher = async (req: any, res: any): Promise<void> => {
        const id = req.params.id;
        const updatedTeacherData = req.body;
        const updatedTeacher = await this.teacherService.updateTeacher(id, updatedTeacherData);
        if (updatedTeacher) {
            res.status(200).json(updatedTeacher);
        } else {
            res.status(404).json({ message: "Teacher not found" });
        }
    }

    deleteTeacher = async (req: any, res: any): Promise<void> => {
        const id = req.params.id;
        await this.teacherService.deleteTeacher(id);
        res.status(204).send();
    }
}