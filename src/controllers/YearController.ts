import { Request, Response } from "express";
import { Year } from "../entities/Year";
import { YearService } from "../services/YearService";


export class YearController {
    
    yearService: YearService;

    constructor(yearService: YearService) {
        this.yearService = yearService;
    }

    createYear = async (request: Request, response: Response): Promise<Response> => {
        const yearBody = request.body as Partial<Year>;
        if (!yearBody) {
            return response.status(400).json({ error: "Request body is required" });
        }
        const newYear = await this.yearService.createYear(yearBody);
        return response.status(201).json(newYear);
    }

    getAllYears = async (request: Request, response: Response): Promise<Response> => {
        const years = await this.yearService.getAllYears();
        return response.status(200).json(years);
    }

    getYearById = async (request: Request, response: Response): Promise<Response> => {
        const id = request.params.id;
        if (!id) {
            return response.status(400).json({ error: "Invalid year ID" });
        }
        const year = await this.yearService.getYearById(id);
        if (!year) {
            return response.status(404).json({ error: "Year not found" });
        }
        return response.status(200).json(year);
    }

    getYearByYear = async (request: Request, response: Response): Promise<Response> => {
        const yearParam = request.params.id;
        const yearNumber = parseInt(yearParam, 10);
        if (isNaN(yearNumber)) {
            return response.status(400).json({ error: "Invalid year parameter" });
        }
        const year = await this.yearService.getYearByYear(yearNumber);
        if (!year) {
            return response.status(404).json({ error: "Year not found" });
        }
        return response.status(200).json(year);
    }

    updateYear = async (request: Request, response: Response): Promise<Response> => {
        const id = request.params.id;
        if (!id) {
            return response.status(400).json({ error: "Invalid year ID" });
        }
        const updatedYearData = request.body as Partial<Year>;
        const updatedYear = await this.yearService.updateYear(id, updatedYearData);
        if (!updatedYear) {
            return response.status(404).json({ error: "Year not found" });
        }
        return response.status(200).json(updatedYear);
    }

    deleteYear = async (request: Request, response: Response): Promise<Response> => {
        const id = request.params.id;
        if (!id) {
            return response.status(400).json({ error: "Invalid year ID" });
        }
        await this.yearService.deleteYear(id);
        return response.status(204).send();
    }

}