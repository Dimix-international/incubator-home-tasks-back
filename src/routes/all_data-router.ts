import {Request, Response, Router} from "express";
import {testingDataRepository} from "../repositories/testing-data-repository";
import {HTTP_STATUSES} from "../data/data";


export const testingDataRouter = Router({});

testingDataRouter.delete('/all-data', async (req:Request, res:Response) => {
    await testingDataRepository.deleteAllData();
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
})