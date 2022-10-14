import {Resolutions_Video} from "../data/data";

export type VideoCreateModel = {
    /**
     * title, author, availableResolutions of video
     */
    title: string;
    author: string;
    availableResolutions: Resolutions_Video[] | null
}