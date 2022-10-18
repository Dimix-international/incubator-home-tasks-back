import {Data} from "../data/data";
import {PostCreateModel} from "../models/posts/PostsCreateModel";
import {PostsViewModelType} from "../models/posts/PostsViewModelType";
import {PostUpdateModel} from "../models/posts/PostsUpdateModel";


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
    },
    deletePostById (id: string) {
        const deletedPostIndex = Data.postsData.findIndex(post => post.id === id);

        if (deletedPostIndex !== -1) {
            Data.postsData.splice(deletedPostIndex, 1);
            return true;
        }
        return false;
    },
    updatePostById (id: string, data: PostUpdateModel) {

        const updatedPost = Data.postsData.find(post => post.id === id);

        if (updatedPost) {
            const { blogId, shortDescription, content, title } = data;

            const { name } = Data.blogsData.find(blog => blog.id === blogId)!;

            updatedPost.blogId = blogId;
            updatedPost.shortDescription = shortDescription;
            updatedPost.content = content;
            updatedPost.title = title;
            updatedPost.blogName = name;

            return true;

        }

        return false;
    }
}