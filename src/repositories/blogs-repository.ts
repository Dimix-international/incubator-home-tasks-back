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
       await BlogsCollection.insertOne(blog);
       return await BlogsCollection.findOne({id: blog.id}, { projection: { _id: 0 }});
    },
    async deleteBlogById (id: string) {
      const {deletedCount} = await BlogsCollection.deleteOne({id});
      return !!deletedCount;
    },
    async updateBlogById (id: string, data: BlogUpdateModel) {
       const {name, youtubeUrl} = data;
       const {matchedCount} = await BlogsCollection.updateOne(
            {id},
            {
                $set: {name, youtubeUrl}
            }
        );
        return !!matchedCount;
    }
}