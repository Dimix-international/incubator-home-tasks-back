import {PostCreateModel} from "../../models/posts/PostsCreateModel";
import {postsRepository} from "../../repositories/posts-repository/posts-repository";
import {blogsQueryRepository} from "../../repositories/blogs-repository/blogs-query-repository";
import {Post} from "./classes";

class PostsService {
    async createPost (data: PostCreateModel): Promise<CreatePostType | null> {
        const { blogId } = data;
        const blog = await blogsQueryRepository.getBlogById(blogId);
        if (blog) {
            const { name } = blog;
            const {content, blogId, shortDescription, title} = data;
            const newPost = new Post(title, shortDescription, content, blogId, name)
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
    }
    async deletePostById (id: string): Promise<Boolean> {
        const {deletedCount} = await postsRepository.deletePostById(id);
        return !!deletedCount;
    }
    async updatePostById (id: string, data: UpdatePostType): Promise<Boolean> {
        const {matchedCount} = await postsRepository.updatePostById(id, data);
        return !!matchedCount;
    }
}

export const postsService = new PostsService();

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