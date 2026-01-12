import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { TeacherService } from "../services/TeacherService";
import { CreateTeacherDto } from "../dtos/CreateTeacherDto";


export class TeacherController {

    private teacherService: TeacherService;

    constructor(teacherService: TeacherService) {
        this.teacherService = teacherService;
    }
    createTeacher = async (request: Request, response: Response): Promise<Response> => {
        const dto = plainToInstance(CreateTeacherDto, request.body);
        const errors = await validate(dto);
        if (errors.length > 0) {
            return response.status(400).json({
                message: "Validation failed",
                errors
            });
        }

        try {
            const newTeacher = await this.teacherService.createTeacher(dto);
            return response.status(201).json(newTeacher);
        } catch (error: any) {
            const message = error?.message || "Failed to create teacher";
            if (message.includes("Enrollment number already in use") || message.includes("Email already in use") || error?.code === "ER_DUP_ENTRY") {
                return response.status(409).json({ error: "Teacher with the same enrollment number or email already exists" });
            }
            return response.status(500).json({ error: "Failed to create teacher. " + message });
        }
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