import { Student } from "../entities/users/Student";
import { StudentRepository } from "../repositories/StudendRepository";
import { CreateStudentDto } from "../dtos/CreateStudentDto";
import { YearRepository } from "../repositories/YearRepository";


export class StudentService {

    private studentRepository: StudentRepository;
    private yearRepository: YearRepository;

    constructor(studentRepository: StudentRepository, yearRepository: YearRepository) {
        this.studentRepository = studentRepository;
        this.yearRepository = yearRepository;
    }

    createStudent = async (dto: CreateStudentDto): Promise<Student> => {
        const year = await this.yearRepository.getYearByYear(dto.year);
        if (!year) {
            throw new Error("Year not found");
        }

        const existingStudent = await this.studentRepository.getStudentByEnrollmentNumber(String(dto.enrollmentNumber));
        if (existingStudent) {
            throw new Error("Enrollment number already in use");
        }

        const student = new Student();
        student.name = dto.name;
        student.enrollmentNumber = dto.enrollmentNumber;
        student.year = year;

        return this.studentRepository.createStudent(student);
    }

    getAllStudents = async (): Promise<Student[]> => {
        return this.studentRepository.getAllStudents();
    }

    getStudentById = async (id: string): Promise<Student | null> => {
        return this.studentRepository.getStudentById(id);
    }

    getStudentByEnrollmentNumber = async (enrollmentNumber: string): Promise<Student | null> => {
        return this.studentRepository.getStudentByEnrollmentNumber(enrollmentNumber);
    }

    updateStudent = async (id: string, updatedStudentData: Partial<Student>): Promise<Student | null> => {
        return this.studentRepository.updateStudent(id, updatedStudentData);
    }

    deleteStudent = async (id: string): Promise<void> => {
        return this.studentRepository.deleteStudent(id);
    }  

}