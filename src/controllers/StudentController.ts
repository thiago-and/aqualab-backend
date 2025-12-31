import { Student } from "../entities/Student";
import { StudentService } from "../services/StudentService";
import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CreateStudentDto } from "../dtos/CreateStudentDto";


export class StudentController {

    studentService: StudentService;

    constructor(studentService: StudentService) {
        this.studentService = studentService;
    }



    createStudent = async (request: Request, response: Response): Promise<Response> => {

        const dto = plainToInstance(CreateStudentDto, request.body);
        const errors = await validate(dto);
        if (errors.length > 0) {
            return response.status(400).json({
                message: "Validation failed",
                errors
            });
        }

        // const studentData = request.body as Partial<Student>;
        // if (!studentData) {
        //     return response.status(400).json({ error: "Request body is required" });
        // }

        try {
            const student = await this.studentService.createStudent(dto);
            return response.status(201).json(student);
        } catch (error) {
            return response.status(500).json({ error: "Failed to create student. " + error });
        }
    }

    getAllStudents = async (request: Request, response: Response): Promise<Response> => {
        const students = await this.studentService.getAllStudents();
        return response.status(200).json(students);
    }

    getStudentById = async (request: Request, response: Response): Promise<Response> => {
        const id = request.params.id;
        const student = await this.studentService.getStudentById(id);
        if (!student) {
            return response.status(404).json({ error: "Student not found" });
        }
        return response.status(200).json(student);
    }

    updateStudent = async (request: Request, response: Response): Promise<Response> => {
        const id = request.params.id;
        const updatedStudentData = request.body as Partial<Student>;
        const updatedStudent = await this.studentService.updateStudent(id, updatedStudentData);
        if (!updatedStudent) {
            return response.status(404).json({ error: "Student not found" });
        }
        return response.status(200).json(updatedStudent);
    }

    deleteStudent = async (request: Request, response: Response): Promise<Response> => {
        const id = request.params.id;
        await this.studentService.deleteStudent(id);
        return response.status(204).send();
    }
}