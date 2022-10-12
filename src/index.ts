import express from 'express';
import bodyParser from "body-parser";
import { videosRouter } from "./routes/videos-router";
import {testingDataRouter} from "./routes/all_data-router";

const app = express();
const port = process.env.PORT || 3000;

const parserMiddleware = bodyParser({});

app.use(parserMiddleware);

app.use('/testing', testingDataRouter);
app.use('/videos', videosRouter);

app.listen(port, () => {
    console.log(`App is listening on port ${port}`)
})