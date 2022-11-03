import {PostViewModelType} from "./PostsViewModelType";

export type PostsGetModel = {
    pageNumber: number,
    pageSize: number,
    sortBy: keyof Omit<PostViewModelType, 'id'>,
    sortDirection: 'asc' | 'desc'
}