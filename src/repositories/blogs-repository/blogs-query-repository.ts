import {BlogsCollection} from "../db";

export const BlogsQueryRepository = {
    async getBlogs(): Promise<BlogType[]> {
        return await BlogsCollection.find({}, { projection: { _id: 0 }}).sort({createdAt: 1}).toArray();
    },
    async getBlogById (id: string): Promise<BlogType | null>  {
        return await BlogsCollection.findOne({id}, { projection: { _id: 0 }});
    },
}


type BlogType = {
    id: string,
    name: string,
    youtubeUrl: string,
    createdAt: Date
}