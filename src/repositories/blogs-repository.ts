import {BlogCreateModel} from "../models/blogs/BlogCreateModel";
import {BlogUpdateModel} from "../models/blogs/BlogUpdateModel";
import {BlogsCollection} from "./db";


export const BlogsRepository = {
   async getBlogs() {
       return await BlogsCollection.find({}, { projection: { _id: 0 }}).sort({createdAt: 1}).toArray();
    },
    async getBlogById (id: string) {
        return await BlogsCollection.findOne({id}, { projection: { _id: 0 }});
    },
    async createBlog (data: BlogCreateModel) {
        const { name, youtubeUrl } = data;

        const insertedBlog = await BlogsCollection.insertOne({
            id: String(Math.random()),
            name,
            youtubeUrl,
            createdAt: new Date()
        });

        return await BlogsCollection.findOne(insertedBlog.insertedId, { projection: { _id: 0 }});
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