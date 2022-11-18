import {Request, Response, Router} from "express";
import {TestingDataRepository} from "../repositories/testing-data-repository";
import {HTTP_STATUSES} from "../data/data";

class TestingDataController {
    private testingDataRepository: TestingDataRepository;

    constructor() {
        this.testingDataRepository = new TestingDataRepository();
    }

    async deleteAllData (req:Request, res:Response) {
        await this.testingDataRepository.deleteAllData();
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    }
}

const testingDataController = new TestingDataController();

export const testingDataRouter = Router({});

testingDataRouter.delete('/all-data', testingDataController.deleteAllData.bind(testingDataController))