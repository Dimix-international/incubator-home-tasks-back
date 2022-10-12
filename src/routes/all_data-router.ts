import {Request, Response, Router} from "express";
import {Data} from "../data/data";


export const testingDataRouter = Router({});

testingDataRouter.delete('/all-data', (req:Request, res:Response) => {
    Data.videosData = [];
    res.send(204);
})