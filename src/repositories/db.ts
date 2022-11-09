import {MongoClient} from "mongodb";
import {settings} from "../settings";

const client = new MongoClient(settings.MONGO_URI);
const db = client.db('social-info');

export const BlogsCollection = db.collection<BlogType>('blogs');
export const PostsCollection = db.collection<PostType>('posts');
export const UsersCollection = db.collection<UserType>('users');

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

type BlogType = {
    id: string,
    name: string,
    youtubeUrl: string,
    createdAt: Date,
}

type PostType = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: Date,
}

type UserType = {
    id: string;
    login: string;
    password: string;
    email: string;
    createdAt: Date
}