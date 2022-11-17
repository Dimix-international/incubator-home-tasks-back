import {BlogUpdateModel} from "../../models/blogs/BlogUpdateModel";
import {BlogsCollection} from "../db";
import {BlogViewModel} from "../../models/blogs/BlogViewModel";

class BlogsRepository {
    async createBlog (blog:BlogViewModel) {
        return await BlogsCollection.insertOne(blog);
    }
    async deleteBlogById (id: string) {
        return await BlogsCollection.deleteOne({id});
    }
    async updateBlogById (id: string, data: BlogUpdateModel) {
        return await BlogsCollection.updateOne(
            {id},
            {
                $set: {...data}
            }
        );
    }
}


export const blogsRepository = new BlogsRepository();