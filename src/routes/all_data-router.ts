import {Request, Response, Router} from "express";
import {testingDataRepository} from "../repositories/testing-data-repository";
import {HTTP_STATUSES} from "../data/data";

class TestingDataController {
    async deleteAllData (req:Request, res:Response) {
        await testingDataRepository.deleteAllData();
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    }
}

const testingDataController = new TestingDataController();

export const testingDataRouter = Router({});

testingDataRouter.delete('/all-data', testingDataController.deleteAllData)