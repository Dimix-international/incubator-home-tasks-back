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
    createBlog (data: BlogCreateModel) {
        const { name, youtubeUrl } = data;

        const insertedBlog = {
            id: String(Math.random()),
            name,
            youtubeUrl,
            createdAt: new Date()
        };

        return BlogsRepository.createBlog(insertedBlog);
    },
     deleteBlogById (id: string) {
        return BlogsRepository.deleteBlogById(id);
    },
     updateBlogById (id: string, data: BlogUpdateModel) {
        return BlogsRepository.updateBlogById(id, data)
    }
}