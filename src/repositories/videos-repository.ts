import {Data, Resolutions_Video} from "../data/data";
import {VideoCreateModel} from "../models/VideoCreateModel";
import {ErrorType, VideoViewErrorType} from "../models/VideoViewErrorType";
import {MAX_LENGTH_AUTHOR, MAX_LENGTH_TITLE, MAX_VIDEO_AGE, MIN_VIDEO_AGE} from "../constants/videos";
import {isInt} from "../helpers/helpers";
import {dateTimeFormat} from "../constants/general/general";
import {VideoViewModel} from "../models/VideoViewModel";
import {VideoUpdateModel} from "../models/VideoUpdateModel";


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

export const videosRepository = {
    getVideos () {
        return Data.videosData
    },
    getVideoById (id: string) {
        const {videosData} = Data;
        return videosData.find(video => video.id === +id);
    },
    deleteVideoById (id: string) {
        const { videosData } = Data;
        const searchIndex = videosData.findIndex(video => video.id === +id);

        if (searchIndex !== -1) {
            videosData.splice(searchIndex, 1);
            return true;
        } else {
            return false
        }
    },
    createVideo (data: VideoCreateModel): VideoViewModel | VideoViewErrorType {
        const { title, author, availableResolutions } = data;

        const errors: ErrorType[] = checkErrorsVideo(data);

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
            return createdVideo;

        } else {
            return { errorsMessages: errors }
        }
    },
    updateVideoById (id: string, data: VideoUpdateModel) {
        const { videosData } = Data;
        const updatedVideo = videosData.find(video => video.id === +id);

        if (updatedVideo) {

            const errors = checkErrorsVideo(data);

            if (!errors.length) {

                const {
                    title,
                    author,
                    publicationDate: publicationDateReqBody,
                    availableResolutions: availableResolutionsReqBody,
                    canBeDownloaded: canBeDownloadedReqBody,
                    minAgeRestriction: minAgeRestrictionReqBody,
                } = data;

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
                return { isUpdated: true };
            } else {
                return { errorsMessages: errors }
            }

        } else {
            return null
        }
    }
}