import {Data} from "../data/data";


export const testingDataRepository = {
    deleteAllData () {
        Data.videosData = [];
        Data.blogsData = [];
        Data.postsData = [];
    }
}