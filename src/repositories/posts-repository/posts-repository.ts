import {CommentsCollection, PostsCollection} from "../db";
import {CreatePostType, UpdatePostType} from "../../domains/posts/posts-service";

class PostsRepository {
    async createPost (data: CreatePostType) {
        return await PostsCollection.insertOne(data);
    }
    async deletePostById (id: string) {
        return await PostsCollection.deleteOne({id});
    }
    async updatePostById (id: string, data: UpdatePostType) {
        return await PostsCollection.updateOne(
            {id},
            {
                $set: {...data}
            }
        )
    }
}

export const postsRepository = new PostsRepository();

