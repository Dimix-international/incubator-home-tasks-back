import {Data} from "../data/data";
import {BlogCreateModel} from "../models/blogs/BlogCreateModel";
import {BlogUpdateModel} from "../models/blogs/BlogUpdateModel";


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
    },
    deleteBlogById (id: string) {
        const deletingBlogIndex = Data.blogsData.findIndex(blog => blog.id === id);
        if (deletingBlogIndex !== -1) {
            Data.blogsData.splice(deletingBlogIndex, 1);
            return true;
        }
        return false;
    },
    updateBlogById (id: string, data: BlogUpdateModel) {
        const updatedBlog = Data.blogsData.find(blog => blog.id === id);

        if (updatedBlog) {
            const { name, youtubeUrl } = data;
            updatedBlog.name = name;
            updatedBlog.youtubeUrl = youtubeUrl;

            return true;
        }
        return false;

    }
}