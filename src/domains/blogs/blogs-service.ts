import {BlogCreateModel} from "../../models/blogs/BlogCreateModel";
import {BlogUpdateModel} from "../../models/blogs/BlogUpdateModel";
import {BlogsRepository} from "../../repositories/blogs-repository/blogs-repository";
import {BlogViewModel} from "../../models/blogs/BlogViewModel";
import {Blog} from "./classes";

export class BlogsService {
    private blogsRepository: BlogsRepository;

    constructor() {
        this.blogsRepository = new BlogsRepository();
    }


    async createBlog (data: BlogCreateModel): Promise<BlogViewModel | null> {
        const { name, youtubeUrl } = data;

        const insertedBlog = new Blog(name, youtubeUrl);

        await this.blogsRepository.createBlog(insertedBlog);
        return {
            name: insertedBlog.name,
            createdAt: insertedBlog.createdAt,
            id: insertedBlog.id,
            youtubeUrl: insertedBlog.youtubeUrl
        }
    }
    async deleteBlogById (id: string): Promise<Boolean> {
        const {deletedCount} = await this.blogsRepository.deleteBlogById(id);
        return !!deletedCount;
    }
    async updateBlogById (id: string, data: BlogUpdateModel) {
        const {matchedCount} = await this.blogsRepository.updateBlogById(id, data);
        return !!matchedCount;
    }
}


