import {Request, Response, Router} from "express";
import {testingDataRepository} from "../repositories/testing-data-repository";


export const testingDataRouter = Router({});

testingDataRouter.delete('/all-data', async (req:Request, res:Response) => {
    await testingDataRepository.deleteAllData();
    res.send(204);
})