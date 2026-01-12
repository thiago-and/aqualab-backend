import { Year } from "../entities/school/Year";
import { TeacherRepository } from "../repositories/TeacherRepository";
import { YearRepository } from "../repositories/YearRepository";

export interface CreateYearDTO {
    year: number;
    teacherId: string;
}

export class YearService {

    private yearRepository: YearRepository;
    private teacherRepository: TeacherRepository;

    constructor(yearRepository: YearRepository, teacherRepository: TeacherRepository) {
        this.yearRepository = yearRepository;
        this.teacherRepository = teacherRepository;
    }

    createYear = async (data: CreateYearDTO): Promise<Year> => {
        
        const teacher = await this.teacherRepository.getTeacherById(data.teacherId);

        if (!teacher) {
            throw new Error("Teacher not found.");
        }

        const year = new Year();
        year.year = data.year;
        year.teacher = teacher;

        return this.yearRepository.createYear(year);
    };

    getAllYears = async (): Promise<Year[]> => {
        return this.yearRepository.getAllYears();
    }

    getYearById = async (id: string): Promise<Year | null> => {
        return this.yearRepository.getYearById(id);
    }

    getYearByYear = async (yearNumber: number): Promise<Year | null> => {
        return this.yearRepository.getYearByYear(yearNumber);
    }

    updateYear = async (id: string, updatedYearData: Partial<Year>): Promise<Year | null> => {
        return this.yearRepository.updateYear(id, updatedYearData);
    }

    deleteYear = async (id: string): Promise<void> => {
        return this.yearRepository.deleteYear(id);
    }

}