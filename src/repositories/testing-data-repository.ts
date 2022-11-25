import {BlogsCollection, CommentsCollection, PostsCollection, UsersCollection} from "./db";
import {injectable} from "inversify";

@injectable()
export class TestingDataRepository {
    async deleteAllData () {
        await Promise.all([
            BlogsCollection.deleteMany({}),
            PostsCollection.deleteMany({}),
            UsersCollection.deleteMany({}),
            CommentsCollection.deleteMany({}),
        ]);
    }
}