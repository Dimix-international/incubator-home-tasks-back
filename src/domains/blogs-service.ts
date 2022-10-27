import {BlogCreateModel} from "../models/blogs/BlogCreateModel";
import {BlogUpdateModel} from "../models/blogs/BlogUpdateModel";
import {BlogsRepository} from "../repositories/blogs-repository";

export const BlogsService = {
    getBlogs() {
        return BlogsRepository.getBlogs();
    },
    getBlogById (id: string) {
        return  BlogsRepository.getBlogById(id);
    },
    async createBlog (data: BlogCreateModel) {
        const { name, youtubeUrl } = data;

        const insertedBlog = {
            id: String(Math.random()),
            name,
            youtubeUrl,
            createdAt: new Date()
        };

        await BlogsRepository.createBlog(insertedBlog);
        return BlogsRepository.getBlogById(insertedBlog.id);
    },
    async deleteBlogById (id: string) {
         const {deletedCount} = await BlogsRepository.deleteBlogById(id);
         return !!deletedCount;
    },
     async updateBlogById (id: string, data: BlogUpdateModel) {
         const {matchedCount} = await BlogsRepository.updateBlogById(id, data);
         return !!matchedCount;
    }
}