import { EntityManager } from "typeorm";
import { Year } from "../entities/Year";

export class YearRepository {

    private manager: EntityManager;

    constructor(manager: EntityManager) {
        this.manager = manager;
    }

    createYear = async (year: Year): Promise<Year> => {
        return this.manager.save(Year, year);
    }

    getAllYears = async (): Promise<Year[]> => {
        return this.manager.find(Year, { relations: ['teacher', 'students'] });
    }

    getYearById = async (id: string): Promise<Year | null> => {
        return this.manager.findOne(Year, { where: { id }, relations: ['teacher', 'students'] });
    }

    getYearByYear = async (yearNumber: number): Promise<Year | null> => {
        return this.manager.findOne(Year, { where: { year: yearNumber }, relations: ['teacher', 'students'] });
    }

    updateYear = async (id: string, updatedYear: Partial<Year>): Promise<Year | null> => {
        const year = await this.manager.findOne(Year, { where: { id } });
        if (!year) {
            return null;
        }
        const updated = Object.assign(year, updatedYear);
        return this.manager.save(Year, updated);
    }

    deleteYear = async (id: string): Promise<void> => {
        await this.manager.delete(Year, id);
    }

}