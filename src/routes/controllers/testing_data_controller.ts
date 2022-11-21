import {TestingDataRepository} from "../../repositories/testing-data-repository";
import {Request, Response} from "express";
import {HTTP_STATUSES} from "../../data/data";

export class TestingDataController {

    constructor(protected testingDataRepository: TestingDataRepository) {
    }

    async deleteAllData(req: Request, res: Response) {
        await this.testingDataRepository.deleteAllData();
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    }
}