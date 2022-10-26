import express from 'express';
import bodyParser from "body-parser";
import { videosRouter } from "./routes/videos-router";
import {testingDataRouter} from "./routes/all_data-router";
import {blogsRouter} from "./routes/blogs-router";
import {postsRouter} from "./routes/posts-router";
import {runDb} from "./repositories/db";

const app = express();
const port = process.env.PORT || 3000;

const parserMiddleware = bodyParser({});

app.use(parserMiddleware);

app.use('/testing', testingDataRouter);
app.use('/videos', videosRouter);
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