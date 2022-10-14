import {Resolutions_Video} from "../data/data";

export type VideoViewModel = {
    title: string;
    author: string;
    availableResolutions: Resolutions_Video[] | null;
    id: number;
    canBeDownloaded: boolean;
    minAgeRestriction: number | null;
    createdAt: string;
    publicationDate: string;
}