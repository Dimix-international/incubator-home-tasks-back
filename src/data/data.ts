export enum Resolutions_Video {
    P144 = 'P144',
    P240 = 'P240',
    P360 = 'P360',
    P480 = 'P480',
    P720 = 'P720',
    P1080 = 'P1080',
    P1440 = 'P1440',
    P2160 = 'P2160',
}
export const enum HTTP_STATUSES {
    OK_200 = 200,
    CREATED_201 = 201,
    NO_CONTENT_204 = 204,
    BAD_REQUEST_400 = 400,
    NOT_FOUND_404 = 404
}


export type RequestVideoType = {
    title: string;
    author: string;
    availableResolutions: Resolutions_Video[] | null
}

export type VideoDataType = RequestVideoType & {
    id: number,
    canBeDownloaded: boolean,
    minAgeRestriction: number | null,
    createdAt: string,
    publicationDate: string,
}


type DataType = {
    videosData: VideoDataType[]
}

export const Data : DataType = {
    videosData: []
}