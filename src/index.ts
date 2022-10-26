import express, {Request, Response} from 'express';
import bodyParser from "body-parser";
import { videosRouter } from "./routes/videos-router";
import {blogsRouter} from "./routes/blogs-router";
import {postsRouter} from "./routes/posts-router";
import {runDb} from "./repositories/db";
import {testingDataRepository} from "./repositories/testing-data-repository";

const app = express();
const port = process.env.PORT || 5000;

const parserMiddleware = bodyParser({});

app.use(parserMiddleware);

app.use('/videos', videosRouter);
app.use('/blogs', blogsRouter);
app.use('/posts', postsRouter);

app.delete('/testing/all-data', async (req:Request, res:Response) => {
    await testingDataRepository.deleteAllData();
    return res.sendStatus(204);
})


const start = async () => {
    try {
        await runDb();
        app.listen(port, () => {
            console.log(`App is listening on port ${port}`)
        })
    } catch (e) {
        console.error(e);
    }
}

start();