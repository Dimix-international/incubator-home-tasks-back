import {BlogViewModel} from "./BlogViewModel";

export type BlogsGetModel = {
    searchNameTerm: string | null,
    pageNumber: number,
    pageSize: number,
    sortBy: keyof Omit<BlogViewModel, 'id'>,
    sortDirection: 'asc' | 'desc'
}