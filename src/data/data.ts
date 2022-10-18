import {VideoDataType} from "./types/videos-types";
import {BlogViewModel} from "../models/blogs/BlogViewModel";
import {PostsViewModelType} from "../models/posts/PostsViewModelType";


export const enum HTTP_STATUSES {
    OK_200 = 200,
    CREATED_201 = 201,
    NO_CONTENT_204 = 204,
    BAD_REQUEST_400 = 400,
    NOT_FOUND_404 = 404,
    UNAUTHORIZED_401 = 401
}


type DataType = {
    videosData: VideoDataType[],
    blogsData: BlogViewModel[],
    postsData: PostsViewModelType[],
}

export const Data : DataType = {
    videosData: [],
    blogsData: [],
    postsData: [],
}