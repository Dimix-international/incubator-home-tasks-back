import express from 'express';
import bodyParser from "body-parser";
import {blogsRouter} from "./routes/blogs-router";
import {postsRouter} from "./routes/posts-router";
import {runDb} from "./repositories/db";
import {testingDataRouter} from "./routes/all_data-router";
import {videosRouter} from "./routes/videos-router";

const app = express();
const port = process.env.PORT || 5000;

const parserMiddleware = bodyParser({});

app.use(parserMiddleware);

app.use('/testing', testingDataRouter);
app.use('/blogs', blogsRouter);
app.use('/posts', postsRouter);
app.use('/videos', videosRouter);

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
