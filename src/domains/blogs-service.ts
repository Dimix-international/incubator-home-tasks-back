import {BlogCreateModel} from "../models/blogs/BlogCreateModel";
import {BlogUpdateModel} from "../models/blogs/BlogUpdateModel";
import {BlogsRepository} from "../repositories/blogs-repository/blogs-repository";
import {BlogViewModel} from "../models/blogs/BlogViewModel";
import {v4 as uuidv4} from 'uuid';

export const BlogsService = {
    async createBlog (data: BlogCreateModel): Promise<BlogViewModel | null> {
        const { name, youtubeUrl } = data;

        const insertedBlog = {
            id: uuidv4(),
            name,
            youtubeUrl,
            createdAt: new Date()
        };

        await BlogsRepository.createBlog(insertedBlog);
        return {
            name: insertedBlog.name,
            createdAt: insertedBlog.createdAt,
            id: insertedBlog.id,
            youtubeUrl: insertedBlog.youtubeUrl
        }
    },
    async deleteBlogById (id: string): Promise<Boolean> {
         const {deletedCount} = await BlogsRepository.deleteBlogById(id);
         return !!deletedCount;
    },
     async updateBlogById (id: string, data: BlogUpdateModel) {
         const {matchedCount} = await BlogsRepository.updateBlogById(id, data);
         return !!matchedCount;
    }
}

