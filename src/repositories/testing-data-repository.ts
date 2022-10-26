import {BlogsCollection, PostsCollection} from "./db";


export const testingDataRepository = {
    async deleteAllData () {
        await BlogsCollection.deleteMany({});
        await PostsCollection.deleteMany({});
    }
}