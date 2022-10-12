import {Request, Response, Router} from "express";
import {ErrorType, RequestVideoType, VideoDataType, Data, Resolutions_Video, UpdateVideoType} from "../data/data";
import {isInt} from "../helpers/helpers";
import {MAX_LENGTH_AUTHOR, MAX_LENGTH_TITLE, MAX_VIDEO_AGE, MIN_VIDEO_AGE} from "../constants/videos";
import {dateTimeFormat} from "../constants/general/general";


export const videosRouter = Router({});
const { videosData } = Data;

const checkErrorsVideo = (data: UpdateVideoType): ErrorType[] => {
    const {
        title,
        author,
        availableResolutions = null,
        canBeDownloaded,
        minAgeRestriction = null,
        publicationDate
    } = data || {};

    const errors: ErrorType[] = [];

    if (!title || typeof title !== 'string' || !title.trim() || title.length > MAX_LENGTH_TITLE) {
        errors.push({
            message: "Incorrect title",
            field: "title"
        })
    }

    if (!author || typeof author !== 'string' || !author.trim() || author.length > MAX_LENGTH_AUTHOR) {
        errors.push({
            message: "Incorrect author",
            field: "author"
        })
    }

    if (availableResolutions !== null && !Array.isArray(availableResolutions)) {
        errors.push({
            message: "Incorrect availableResolutions",
            field: "availableResolutions"
        })
    }

    if ( availableResolutions !== null && Array.isArray(availableResolutions)) {

        const res = availableResolutions.every(res => Object.keys(Resolutions_Video).includes(res));

        if (!res) {
            errors.push({
                message: "Incorrect availableResolutions",
                field: "availableResolutions"
            })
        }
    }

    if (canBeDownloaded && typeof canBeDownloaded !== 'boolean') {
        errors.push({
            message: "Incorrect canBeDownloaded",
            field: "canBeDownloaded"
        })
    }

    if (minAgeRestriction !== null && typeof minAgeRestriction !== 'number') {
        errors.push({
            message: "Incorrect minAgeRestriction",
            field: "minAgeRestriction"
        })
    }

    if (typeof minAgeRestriction === 'number') {
        if (!isInt(minAgeRestriction) || minAgeRestriction > MAX_VIDEO_AGE || minAgeRestriction < MIN_VIDEO_AGE) {
            errors.push({
                message: "Incorrect minAgeRestriction",
                field: "minAgeRestriction"
            })
        }
    }

    if  (publicationDate && !dateTimeFormat.test(publicationDate)) {
        errors.push({
            message: "Incorrect publicationDate",
            field: "publicationDate"
        })
    }

    return errors;
};

const getUnicResolutionOrNull = (availableResolutions:  Resolutions_Video[] | null): Resolutions_Video[] | null  => {
   const result = Array.isArray(availableResolutions)
       ? availableResolutions.filter(res => Object.keys(Resolutions_Video).includes(res))
       : null;

   return  result?.length ? result : null
}


videosRouter.get('/', (req:Request, res:Response) => {
    res.status(200).send(Data.videosData)
});

videosRouter.get('/:id', (req:Request, res:Response) => {
    const { id } = req.params;

    const searchVideo = videosData.find(video => video.id === +id);

    if (searchVideo) {
        res.status(200).send(searchVideo)
    } else {
        res.send(404);
    }
});

videosRouter.delete('/:id', (req:Request, res:Response) => {
    const { id } = req.params;

    const searchIndex = videosData.findIndex(video => video.id === +id);

    if (searchIndex !== -1) {
        videosData.splice(searchIndex, 1);
        res.send(204);
    } else {
        res.send(404);
    }
});

videosRouter.post('/', (req:Request, res:Response) => {

    const { title, author, availableResolutions } = req.body as RequestVideoType || {};

    const errors: ErrorType[] = checkErrorsVideo(req.body);

    if (!errors.length) {

        const date = new Date();
        const nextDate = date.setDate(date.getDate() + 1);

        const id = Math.random();
        const createdVideo: VideoDataType = {
            id,
            title,
            createdAt: new Date().toISOString(),
            canBeDownloaded: false,
            minAgeRestriction: null,
            publicationDate: new Date(nextDate).toISOString(),
            author,
            availableResolutions: getUnicResolutionOrNull(availableResolutions)
        }

        videosData.push(createdVideo);
        res.status(201).send(createdVideo);

    } else {
        res.status(400).send({
            errorsMessages: errors
        });
    }

});

videosRouter.put('/:id', (req:Request, res:Response) => {
    const { id } = req.params;

    const updatedVideo = videosData.find(video => video.id === +id);

    if (updatedVideo) {

        const errors = checkErrorsVideo(req.body);

        if (!errors.length) {

            const {
                title,
                author,
                publicationDate,
                availableResolutions = null,
                canBeDownloaded = false,
                minAgeRestriction = null,
            } = req.body as UpdateVideoType;

            const {id, createdAt } = updatedVideo;

            Data.videosData = videosData.map(video => video.id === updatedVideo.id
                ? {
                    id,
                    createdAt,
                    title,
                    publicationDate,
                    author,
                    availableResolutions,
                    minAgeRestriction,
                    canBeDownloaded
                }
                : video
            )
            res.send(204);
        } else {
            res.status(400).send({
                errorsMessages: errors
            });
        }

    } else {
        res.send(404);
    }
})