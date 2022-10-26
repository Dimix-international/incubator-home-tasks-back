import {PostCreateModel} from "../models/posts/PostsCreateModel";
import {PostUpdateModel} from "../models/posts/PostsUpdateModel";
import {BlogsCollection, PostsCollection} from "./db";


export const postsRepository = {
    async getPosts () {
        return await PostsCollection.find({}, { projection: { _id: 0 }}).sort({createdAt: 1}).toArray();
    },
    async getPostById (id: string) {
        return await PostsCollection.findOne({id}, { projection: { _id: 0 }});
    },
    async createPost (data: PostCreateModel) {

        const { blogId } = data;
        const blog = await BlogsCollection.findOne({id: blogId});

        if (blog) {
            const { name } = blog;

            const insertedBlog = await PostsCollection.insertOne({
                id: String(Math.random()),
                ...data,
                blogName: name,
                createdAt: new Date()
            });

            return await PostsCollection.findOne(insertedBlog.insertedId, { projection: { _id: 0 }});
        }
        return null;

    },
    async deletePostById (id: string) {
        const {deletedCount} = await PostsCollection.deleteOne({id});
        return !!deletedCount;
    },
    async updatePostById (id: string, data: PostUpdateModel) {
        const { blogId, shortDescription, content, title } = data;
        const {matchedCount} = await PostsCollection.updateOne(
            {id},
            {
                $set: {blogId, shortDescription, content, title}
            }
        )
        return !!matchedCount;
    }
}