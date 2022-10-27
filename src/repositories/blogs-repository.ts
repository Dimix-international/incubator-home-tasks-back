import {BlogCreateModel} from "../models/blogs/BlogCreateModel";
import {BlogUpdateModel} from "../models/blogs/BlogUpdateModel";
import {BlogsCollection} from "./db";
import {BlogViewModel} from "../models/blogs/BlogViewModel";


export const BlogsRepository = {
   async getBlogs() {
       return BlogsCollection.find({}, { projection: { _id: 0 }}).sort({createdAt: 1}).toArray();
    },
    async getBlogById (id: string) {
        return BlogsCollection.findOne({id}, { projection: { _id: 0 }});
    },
    async createBlog (blog:BlogViewModel) {
      return await BlogsCollection.insertOne(blog);
    },
    async deleteBlogById (id: string) {
      return await BlogsCollection.deleteOne({id});
    },
    async updateBlogById (id: string, data: BlogUpdateModel) {
       const {name, youtubeUrl} = data;
       return await BlogsCollection.updateOne(
            {id},
            {
                $set: {name, youtubeUrl}
            }
        );
    }
}