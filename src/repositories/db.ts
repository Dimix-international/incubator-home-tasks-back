import {settings} from "../settings";
import mongoose from 'mongoose';
import BlogSchema from "../schemasMongoose/BlogSchema";
import PostSchema from "../schemasMongoose/PostSchema";

export const BlogsCollection = BlogSchema;
export const PostsCollection = PostSchema;

export async function runDb() {
    try {
        await mongoose.connect(settings.MONGO_URI)
        console.log('Connected successfully to mongo server!');
    } catch (e) {
        console.log(e)
    }
}