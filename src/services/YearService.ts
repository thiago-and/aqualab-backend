import { Year } from "../entities/school/Year";
import { YearRepository } from "../repositories/YearRepository";

export class YearService {

    private yearRepository: YearRepository;

    constructor(yearRepository: YearRepository) {
        this.yearRepository = yearRepository;
    }

    createYear = async (yearBody: Partial<Year>): Promise<Year> => {
        const year = new Year();
        year.year = yearBody.year!;

        return this.yearRepository.createYear(year);
    }

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