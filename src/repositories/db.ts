import {MongoClient} from "mongodb";
import {settings} from "../settings";
import {BlogViewModel} from "../models/blogs/BlogViewModel";
import {PostsViewModelType} from "../models/posts/PostsViewModelType";

// const client = new MongoClient(settings.MONGO_URI);
const client = new MongoClient('mongodb+srv://admin:qwerty123@cluster0.77jtikg.mongodb.net/incubatorProject?retryWrites=true&w=majority')
const db = client.db('social-info');

export const BlogsCollection = db.collection<BlogViewModel>('blogs');
export const PostsCollection = db.collection<PostsViewModelType>('posts');

export async function runDb() {
    try {
        await client.connect();
        await client.db('social-info').command({ping: 1});
        console.log('Connected successfully to mongo server!');
    } catch (e) {
        console.log(e)
        await client.close();
    }
}