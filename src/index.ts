import express, {Request, Response} from 'express';
import bodyParser from "body-parser";
import {blogsRouter} from "./routes/blogs-router";
import {postsRouter} from "./routes/posts-router";
import {runDb} from "./repositories/db";
import {testingDataRepository} from "./repositories/testing-data-repository";
import {testingDataRouter} from "./routes/all_data-router";

const app = express();
const port = process.env.PORT || 5000;

const parserMiddleware = bodyParser({});

app.use(parserMiddleware);

app.use('/testing', testingDataRouter);
app.use('/blogs', blogsRouter);
app.use('/posts', postsRouter);

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

app.delete('/testing/all-data', async (req:Request, res:Response) => {
    await testingDataRepository.deleteAllData();
    return res.sendStatus(204);
})