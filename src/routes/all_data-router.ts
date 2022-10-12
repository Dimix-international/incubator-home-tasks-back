import {Request, Response, Router} from "express";
import {Data} from "../data/data";


export const allDataRouter = Router({});

allDataRouter.delete('/', (req:Request, res:Response) => {
    Data.videosData = [];
    res.send(204);
})