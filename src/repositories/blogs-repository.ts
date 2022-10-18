import {Data} from "../data/data";
import {BlogCreateModel} from "../models/blogs/BlogCreateModel";


export const BlogsRepository = {
    getBlogs() {
        return Data.blogsData
    },
    getBlogById (id: string) {
        return Data.blogsData.find(blog => blog.id === id);
    },
    createBlog (data: BlogCreateModel) {
        const { name, youtubeUrl } = data;

        const newBlog = {
            id: String(Math.random()),
            name,
            youtubeUrl,
        };

        Data.blogsData.push(newBlog);
        return newBlog;
    }
}