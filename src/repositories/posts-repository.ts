import {PostCreateModel} from "../models/posts/PostsCreateModel";
import {PostUpdateModel} from "../models/posts/PostsUpdateModel";
import {BlogsCollection, PostsCollection} from "./db";


type CreatePostType = PostCreateModel & {
    id: string,
    blogName: string,
    createdAt: Date,
}

export const postsRepository = {
    async getPosts () {
        return await PostsCollection.find({}, { projection: { _id: 0 }}).sort({createdAt: 1}).toArray();
    },
    async getPostById (id: string) {
        return await PostsCollection.findOne({id}, { projection: { _id: 0 }});
    },
    async createPost (data: CreatePostType) {
       return await PostsCollection.insertOne(data);
    },
    async deletePostById (id: string) {
        return await PostsCollection.deleteOne({id});
    },
    async updatePostById (id: string, data: PostUpdateModel) {
        const { blogId, shortDescription, content, title } = data;
        return await PostsCollection.updateOne(
            {id},
            {
                $set: {blogId, shortDescription, content, title}
            }
        )
    }
}