import {Data} from "../data/data";
import {PostCreateModel} from "../models/posts/PostsCreateModel";
import {PostsViewModelType} from "../models/posts/PostsViewModelType";


export const postsRepository = {
    getPosts () {
        return Data.postsData
    },
    getPostById (id: string) {
        return Data.postsData.find(post => post.id === id);
    },
    createPost (data: PostCreateModel) {

        const { blogId } = data;
        const blog = Data.blogsData.find(blog => blog.id === blogId)!;

        const { name } = blog;
        const newPost:PostsViewModelType = {
            id: String(Math.random()),
            ...data,
            blogName: name
        };

        Data.postsData.push(newPost);
        return newPost;


    }
}