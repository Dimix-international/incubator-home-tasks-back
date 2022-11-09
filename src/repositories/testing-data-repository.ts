import {BlogsCollection, PostsCollection, UsersCollection} from "./db";


export const testingDataRepository = {
    async deleteAllData () {
        await Promise.all([
            BlogsCollection.deleteMany({}),
            PostsCollection.deleteMany({}),
            UsersCollection.deleteMany({}),
        ]);
    }
}