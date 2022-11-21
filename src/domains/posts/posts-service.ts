import {PostCreateModel} from "../../models/posts/PostsCreateModel";
import {PostsRepository} from "../../repositories/posts-repository/posts-repository";
import {BlogsQueryRepository} from "../../repositories/blogs-repository/blogs-query-repository";
import {Post} from "./classes";

export class PostsService {


    constructor(protected blogsQueryRepository: BlogsQueryRepository,
                protected postsRepository: PostsRepository) {}

    async createPost (data: PostCreateModel): Promise<CreatePostType | null> {
        const { blogId } = data;
        const blog = await this.blogsQueryRepository.getBlogById(blogId);
        if (blog) {
            const { name } = blog;
            const {content, blogId, shortDescription, title} = data;
            const newPost = new Post(title, shortDescription, content, blogId, name)
            await this.postsRepository.createPost(newPost);
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
        const {deletedCount} = await this.postsRepository.deletePostById(id);
        return !!deletedCount;
    }
    async updatePostById (id: string, data: UpdatePostType): Promise<Boolean> {
        const {matchedCount} = await this.postsRepository.updatePostById(id, data);
        return !!matchedCount;
    }
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