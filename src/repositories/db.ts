import {MongoClient} from "mongodb";
import {settings} from "../settings";
import {BlogViewModel} from "../models/blogs/BlogViewModel";
import {PostsViewModelType} from "../models/posts/PostsViewModelType";

const client = new MongoClient(settings.MONGO_URI);
const db = client.db('social-info');

export const BlogsCollection = db.collection<BlogViewModel>('blogs');
export const PostsCollection = db.collection<PostsViewModelType>('posts');

export const runDb = async () => {
    try {
        await client.connect();
        await client.db('social-info').command({ping: 1});
        console.log('Connected successfully to mongo server!');
    } catch (e) {
        if (e instanceof Error) {
            console.log(e.message)
        } else {
            console.log('Was error when connected');
        }
        await client.close();
    }
}