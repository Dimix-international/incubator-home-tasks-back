import {Router} from "express";
import {testingDataController} from "../composition-root";


export const testingDataRouter = Router({});

testingDataRouter.delete('/all-data', testingDataController.deleteAllData.bind(testingDataController))