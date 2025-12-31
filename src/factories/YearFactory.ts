import { AppDataSource } from "../database/data-source";
import { YearRepository } from "../repositories/YearRepository";
import { YearService } from "../services/YearService";
import { YearController } from "../controllers/YearController";

export function makeYearController(): YearController {
    const manager = AppDataSource.manager;
    const yearRepository = new YearRepository(manager);
    const yearService = new YearService(yearRepository);
    const yearController = new YearController(yearService);

    return yearController;
}
