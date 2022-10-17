import {Request, Response, Router} from "express";
import {HTTP_STATUSES} from "../data/data";
import {RequestWithBody, RequestWithParams, RequestWithParamsBody} from "../types/types";
import {VideoURIParamsModel} from "../models/videos/VideoURIParamsModel";
import {VideoUpdateModel} from "../models/videos/VideoUpdateModel";
import {VideoCreateModel} from "../models/videos/VideoCreateModel";
import {VideoViewModel} from "../models/videos/VideoViewModel";
import {VideoViewErrorType} from "../models/videos/VideoViewErrorType";
import {videosRepository} from "../repositories/videos-repository";


export const videosRouter = Router({});

videosRouter.get('/', (req:Request, res:Response<VideoViewModel[]>) => {
    res.status(HTTP_STATUSES.OK_200).send(videosRepository.getVideos())
});

videosRouter.get('/:id', (req:Request<VideoURIParamsModel>, res:Response<VideoViewModel>) => {
    const { id } = req.params;

    const searchVideo = videosRepository.getVideoById(id);

    if (searchVideo) {
        res.status(HTTP_STATUSES.OK_200).send(searchVideo)
    } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
});

videosRouter.delete('/:id', (req:RequestWithParams<VideoURIParamsModel>, res:Response) => {
    const { id } = req.params;

    const isDeletedVideo = videosRepository.deleteVideoById(id);

    res.send(isDeletedVideo
        ? HTTP_STATUSES.NO_CONTENT_204
        : HTTP_STATUSES.NOT_FOUND_404
    );
});

videosRouter.post('/', (req:RequestWithBody<VideoCreateModel>, res:Response<VideoViewModel | VideoViewErrorType>) => {

    const createdVideo = videosRepository.createVideo(req.body);

    if ('errorsMessages' in createdVideo) {
        res.status(HTTP_STATUSES.BAD_REQUEST_400).send(createdVideo);
    } else {
        res.status(HTTP_STATUSES.CREATED_201).send(createdVideo);
    }

});

videosRouter.put('/:id', (req:RequestWithParamsBody<VideoURIParamsModel, VideoUpdateModel>, res:Response) => {
    const { id } = req.params;

    const updatedVideo = videosRepository.updateVideoById(id, req.body);

    if (updatedVideo && 'errorsMessages' in updatedVideo) {
        res.status(HTTP_STATUSES.BAD_REQUEST_400).send(updatedVideo);
        return;
    }

    res.sendStatus(!updatedVideo
        ? HTTP_STATUSES.NOT_FOUND_404
        : HTTP_STATUSES.NO_CONTENT_204
    );

})