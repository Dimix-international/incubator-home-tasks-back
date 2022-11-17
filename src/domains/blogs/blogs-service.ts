import {BlogCreateModel} from "../../models/blogs/BlogCreateModel";
import {BlogUpdateModel} from "../../models/blogs/BlogUpdateModel";
import {blogsRepository} from "../../repositories/blogs-repository/blogs-repository";
import {BlogViewModel} from "../../models/blogs/BlogViewModel";
import {Blog} from "./classes";

class BlogsService {
    async createBlog (data: BlogCreateModel): Promise<BlogViewModel | null> {
        const { name, youtubeUrl } = data;

        const insertedBlog = new Blog(name, youtubeUrl);

        await blogsRepository.createBlog(insertedBlog);
        return {
            name: insertedBlog.name,
            createdAt: insertedBlog.createdAt,
            id: insertedBlog.id,
            youtubeUrl: insertedBlog.youtubeUrl
        }
    }
    async deleteBlogById (id: string): Promise<Boolean> {
        const {deletedCount} = await blogsRepository.deleteBlogById(id);
        return !!deletedCount;
    }
    async updateBlogById (id: string, data: BlogUpdateModel) {
        const {matchedCount} = await blogsRepository.updateBlogById(id, data);
        return !!matchedCount;
    }
}

export const blogsService = new BlogsService();

