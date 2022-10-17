import {VideoDataType} from "./types/videos-types";
import {BlogType} from "./types/blogs-types";
import {PostsType} from "./types/posts-types";

export const enum HTTP_STATUSES {
    OK_200 = 200,
    CREATED_201 = 201,
    NO_CONTENT_204 = 204,
    BAD_REQUEST_400 = 400,
    NOT_FOUND_404 = 404
}


type DataType = {
    videosData: VideoDataType[],
    blogsData: BlogType[],
    postsData: PostsType[],
}

export const Data : DataType = {
    videosData: [],
    blogsData: [],
    postsData: [],
}