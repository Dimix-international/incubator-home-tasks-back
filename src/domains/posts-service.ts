import {PostCreateModel} from "../models/posts/PostsCreateModel";
import {PostUpdateModel} from "../models/posts/PostsUpdateModel";
import {postsRepository} from "../repositories/posts-repository";
import {BlogsRepository} from "../repositories/blogs-repository";


export const postsService = {
    getPosts () {
        return postsRepository.getPosts()
    },
    getPostById (id: string) {
        return  postsRepository.getPostById(id);
    },
    async createPost (data: PostCreateModel) {
        const { blogId } = data;
        const blog = await BlogsRepository.getBlogById(blogId);
        if (blog) {
            const { name } = blog;
            return await postsRepository.createPost({
                id: String(Math.random()),
                ...data,
                blogName: name,
                createdAt: new Date()
            });
        }
        return null;
    },
     deletePostById (id: string) {
        return postsRepository.deletePostById(id)
    },
    async updatePostById (id: string, data: PostUpdateModel) {
        return postsRepository.updatePostById(id, data);
    }
}