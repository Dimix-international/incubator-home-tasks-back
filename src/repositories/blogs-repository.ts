import {BlogCreateModel} from "../models/blogs/BlogCreateModel";
import {BlogUpdateModel} from "../models/blogs/BlogUpdateModel";
import {BlogsCollection} from "./db";

export const BlogsRepository = {
   async getBlogs() {
       return  BlogsCollection.find({}, { _id: 0, __v: 0 }).sort({createdAt: 1});
    },
    async getBlogById (id: string) {
        return  BlogsCollection.findOne({id}, { _id: 0, __v: 0 });
    },
    async createBlog (data: BlogCreateModel) {
        const { name, youtubeUrl } = data;

        const insertedBlog = await BlogsCollection.create({
            id: String(Math.random()),
            name,
            youtubeUrl,
            createdAt: new Date()
        });

        return BlogsCollection.findOne({_id: insertedBlog._id}, { _id: 0, __v: 0 });
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