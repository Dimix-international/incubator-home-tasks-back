import {TestingDataRepository} from "../../repositories/testing-data-repository";
import {Request, Response} from "express";
import {HTTP_STATUSES} from "../../data/data";
import {inject, injectable} from "inversify";

@injectable()
export class TestingDataController {

    constructor(@inject(TestingDataRepository) protected testingDataRepository: TestingDataRepository) {
    }

    async deleteAllData(req: Request, res: Response) {
        await this.testingDataRepository.deleteAllData();
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    }
}