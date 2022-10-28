import {PostsCollection} from "../db";

export const PostsQueryRepository = {
    async getPosts (): Promise<PostType[]> {
        return await PostsCollection.find({}, { projection: { _id: 0 }}).sort({createdAt: 1}).toArray();
    },
    async getPostById (id: string): Promise<PostType | null> {
        return await PostsCollection.findOne({id}, { projection: { _id: 0 }});
    },
}

type PostType = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: Date
}