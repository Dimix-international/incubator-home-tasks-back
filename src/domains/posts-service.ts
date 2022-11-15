import {PostCreateModel} from "../models/posts/PostsCreateModel";
import {PostUpdateModel} from "../models/posts/PostsUpdateModel";
import {postsRepository} from "../repositories/posts-repository/posts-repository";
import {BlogsQueryRepository} from "../repositories/blogs-repository/blogs-query-repository";
import {v4 as uuidv4} from 'uuid';

export const postsService = {
    async createPost (data: PostCreateModel): Promise<CreatePostType | null> {
        const { blogId } = data;
        const blog = await BlogsQueryRepository.getBlogById(blogId);
        if (blog) {
            const { name } = blog;
            const newPost = {
                id: uuidv4(),
                ...data,
                blogName: name,
                createdAt: new Date()
            };
            await postsRepository.createPost(newPost);
            return {
                id: newPost.id,
                createdAt: newPost.createdAt,
                blogName: newPost.blogName,
                title: newPost.title,
                content: newPost.content,
                blogId: newPost.blogId,
                shortDescription: newPost.shortDescription
            };
        }
        return null;
    },
     async deletePostById (id: string): Promise<Boolean> {
         const {deletedCount} = await postsRepository.deletePostById(id);
         return !!deletedCount;
    },
    async updatePostById (id: string, data: PostUpdateModel): Promise<Boolean> {
        const {matchedCount} = await postsRepository.updatePostById(id, data);
        return !!matchedCount;
    },
}

export type CreatePostType = {
    id: string,
    blogName: string,
    createdAt: Date,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
}

export type UpdatePostType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
}