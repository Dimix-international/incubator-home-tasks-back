import {Request, Response, Router} from "express";
import {
    Data,
    Resolutions_Video,
    HTTP_STATUSES
} from "../data/data";
import {isInt} from "../helpers/helpers";
import {MAX_LENGTH_AUTHOR, MAX_LENGTH_TITLE, MAX_VIDEO_AGE, MIN_VIDEO_AGE} from "../constants/videos";
import {dateTimeFormat} from "../constants/general/general";
import {RequestWithBody, RequestWithParams, RequestWithParamsBody} from "../types/types";
import {VideoURIParamsModel} from "../models/VideoURIParamsModel";
import {VideoUpdateModel} from "../models/VideoUpdateModel";
import {VideoCreateModel} from "../models/VideoCreateModel";
import {VideoViewModel} from "../models/VideoViewModel";
import {ErrorType, VideoViewErrorType} from "../models/VideoViewErrorType";


export const videosRouter = Router({});

type CheckErrorType = {
    title: string;
    author: string;
    availableResolutions: Resolutions_Video[] | null,
    canBeDownloaded?: boolean,
    minAgeRestriction?: number | null,
    publicationDate?: string,
}

const checkErrorsVideo = (data: CheckErrorType): ErrorType[] => {
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


videosRouter.get('/', (req:Request, res:Response<VideoViewModel[]>) => {
    res.status(HTTP_STATUSES.OK_200).send(Data.videosData)
});

videosRouter.get('/:id', (req:Request<VideoURIParamsModel>, res:Response<VideoViewModel>) => {
    const { videosData } = Data;
    const { id } = req.params;

    const searchVideo = videosData.find(video => video.id === +id);

    if (searchVideo) {
        res.status(HTTP_STATUSES.OK_200).send(searchVideo)
    } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
});

videosRouter.delete('/:id', (req:RequestWithParams<VideoURIParamsModel>, res:Response) => {
    const { videosData } = Data;
    const { id } = req.params;

    const searchIndex = videosData.findIndex(video => video.id === +id);

    if (searchIndex !== -1) {
        videosData.splice(searchIndex, 1);
        res.send(HTTP_STATUSES.NO_CONTENT_204);
    } else {
        res.send(HTTP_STATUSES.NOT_FOUND_404);
    }
});

videosRouter.post('/', (req:RequestWithBody<VideoCreateModel>, res:Response<VideoViewModel | VideoViewErrorType>) => {
    const { title, author, availableResolutions } = req.body;

    const errors: ErrorType[] = checkErrorsVideo(req.body);

    if (!errors.length) {

        const date = new Date();
        const nextDate = date.setDate(date.getDate() + 1);

        const id = Math.random();
        const createdVideo: VideoViewModel = {
            id,
            title,
            createdAt: new Date().toISOString(),
            canBeDownloaded: false,
            minAgeRestriction: null,
            publicationDate: new Date(nextDate).toISOString(),
            author,
            availableResolutions: getUnicResolutionOrNull(availableResolutions)
        }

        Data.videosData.push(createdVideo);
        res.status(HTTP_STATUSES.CREATED_201).send(createdVideo);

    } else {
        res.status(HTTP_STATUSES.BAD_REQUEST_400).send({
            errorsMessages: errors
        });
    }

});

videosRouter.put('/:id', (req:RequestWithParamsBody<VideoURIParamsModel, VideoUpdateModel>, res:Response) => {
    const { videosData } = Data;
    const { id } = req.params;

    const updatedVideo = videosData.find(video => video.id === +id);

    if (updatedVideo) {

        const errors = checkErrorsVideo(req.body);

        if (!errors.length) {

            const {
                title,
                author,
                publicationDate: publicationDateReqBody,
                availableResolutions: availableResolutionsReqBody,
                canBeDownloaded: canBeDownloadedReqBody,
                minAgeRestriction: minAgeRestrictionReqBody,
            } = req.body;

            Data.videosData = videosData.map(video => video.id === updatedVideo.id
                    ? {
                        ...video,
                        title,
                        author,
                        publicationDate: publicationDateReqBody || video.publicationDate,
                        availableResolutions: availableResolutionsReqBody || video.availableResolutions,
                        minAgeRestriction: minAgeRestrictionReqBody || video.minAgeRestriction,
                        canBeDownloaded: canBeDownloadedReqBody || video.canBeDownloaded
                    }
                    : video
            )
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        } else {
            res.status(HTTP_STATUSES.BAD_REQUEST_400).send({
                errorsMessages: errors
            });
        }

    } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
})