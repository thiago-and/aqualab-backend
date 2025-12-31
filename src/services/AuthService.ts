import { StudentRepository } from "../repositories/StudendRepository";
import { TeacherRepository } from "../repositories/TeacherRepository";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class AuthService {

    private teacherRepository: TeacherRepository;
    private studentRepository: StudentRepository;

    constructor(
        teacherRepository: TeacherRepository,
        studentRepository: StudentRepository
    ) {
        this.teacherRepository = teacherRepository;
        this.studentRepository = studentRepository;
    }

    async loginTeacher(email: string, password: string): Promise<string> {
        
        const teacher = await this.teacherRepository.getTeacherByEmail(email);

        if (!teacher || !teacher.password) {
            throw new Error("Invalid credentials");
        }

        const passwordMatch = await bcrypt.compare(password, teacher.password);

        if (!passwordMatch) {
            throw new Error("Invalid credentials");
        }

        const token = jwt.sign(
            {
                role: "teacher"
            },
            process.env.JWT_SECRET as string,
            {
                subject: teacher.id.toString(),
                expiresIn: "1d"
            }
        );

        return token;
    }

    async loginStudent(enrollmentNumber: string): Promise<string> {
        const student = await this.studentRepository.getStudentByEnrollmentNumber(enrollmentNumber);

        if (!student) {
            throw new Error("Invalid credentials");
        }

        const token = jwt.sign(
            {
                role: "student"
            },
            process.env.JWT_SECRET as string,
            {
                subject: student.id.toString(),
                expiresIn: "1d"
            }
        );

        return token;
    }
}
