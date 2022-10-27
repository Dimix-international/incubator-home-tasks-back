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
            const newPost = {
                id: String(Math.random()),
                ...data,
                blogName: name,
                createdAt: new Date()
            };
            await postsRepository.createPost(newPost);
            return postsRepository.getPostById(newPost.id);
        }
        return null;
    },
     async deletePostById (id: string) {
         const {deletedCount} = await postsRepository.deletePostById(id);
         return !!deletedCount;
    },
    async updatePostById (id: string, data: PostUpdateModel) {
        const {matchedCount} = await postsRepository.updatePostById(id, data);
        return !!matchedCount;
    }
}