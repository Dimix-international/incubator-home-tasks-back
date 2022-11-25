import {Router} from "express";
import {container} from "../composition-root";
import {TestingDataController} from "./controllers/testing_data_controller";

const testingDataController = container.resolve(TestingDataController);


export const testingDataRouter = Router({});

testingDataRouter.delete('/all-data', testingDataController.deleteAllData.bind(testingDataController))