import {Request, Response, Router} from "express";
import {BlogsViewModel, BlogViewModel, PostsForBlogViewModel} from "../models/blogs/BlogViewModel";
import {HTTP_STATUSES} from "../data/data";
import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsBody,
    RequestWithQuery,
    RequestWithQueryParamsAndParams,
} from "../types/types";
import {BlogURIParamsModel} from "../models/blogs/BlogURIParamsModel";
import {BlogsValidatorSchema} from "../validator-schemas/blogs-validator-schema";
import {inputValidatorMiddlewares} from "../middlewares/input-validator-middlewares";
import {BlogCreateModel} from "../models/blogs/BlogCreateModel";
import {authMiddleware} from "../middlewares/auth-middleware";
import {BlogUpdateModel} from "../models/blogs/BlogUpdateModel";
import {BlogsService} from "../domains/blogs-service";
import {BlogsQueryRepository} from "../repositories/blogs-repository/blogs-query-repository";
import {BlogsGetModel} from "../models/blogs/BlogsGetModel";
import {BlogCreatePostBlogURIParamsModel} from "../models/blogs/BlogCreatePostBlogURIParamsModel";
import {BlogCreatePostForBlogModel} from "../models/blogs/BlogCreatePostForBlogModel";
import {BlogWithCreatedPostViewModel} from "../models/blogs/BlogWithCreatedPostViewModel";
import {CreatePostForBlogValidatorSchema} from "../validator-schemas/create-post-for-blog-validator-schema";
import {postsService} from "../domains/posts-service";
import {PostsQueryRepository} from "../repositories/posts-repository/posts-query-repository";
import {PostsGetModel} from "../models/posts/PostsGetModel";


export const blogsRouter = Router({});

blogsRouter.get('/', async (req: RequestWithQuery<BlogsGetModel>, res: Response<BlogsViewModel>) => {
    const {
        searchNameTerm = null,
        pageNumber = 1,
        pageSize = 10,
        sortBy = 'createdAt',
        sortDirection = 'desc'
    } = req.query;

    const blogs = await BlogsQueryRepository.getBlogs(searchNameTerm, pageNumber, pageSize, sortBy, sortDirection);
    res.status(HTTP_STATUSES.OK_200).send(blogs);
});

blogsRouter.get('/:id', async (req: RequestWithParams<BlogURIParamsModel>, res: Response<BlogViewModel>) => {

    const { id } = req.params;

    const searchedBlog = await BlogsQueryRepository.getBlogById(id);

    if (searchedBlog) {
        res.status(HTTP_STATUSES.OK_200).send(searchedBlog);
    } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
});

blogsRouter.post('/',
    authMiddleware,
    BlogsValidatorSchema,
    inputValidatorMiddlewares,
    async (req: RequestWithBody<BlogCreateModel>, res: Response<BlogViewModel>) => {

    const newBlog = await BlogsService.createBlog(req.body) as BlogViewModel;
    res.status(HTTP_STATUSES.CREATED_201).send(newBlog);
});

blogsRouter.delete('/:id', authMiddleware, async (req:RequestWithParams<BlogURIParamsModel>, res: Response) => {
    const { id } = req.params;
    const isDeletedBlog = await BlogsService.deleteBlogById(id);
    res.sendStatus(isDeletedBlog ? HTTP_STATUSES.NO_CONTENT_204 : HTTP_STATUSES.NOT_FOUND_404);
});

blogsRouter.put('/:id',
    authMiddleware,
    BlogsValidatorSchema,
    inputValidatorMiddlewares,
    async (req: RequestWithParamsBody<BlogURIParamsModel, BlogUpdateModel>, res: Response) => {
        const { id } = req.params;
        const isUpdatedBlog = await BlogsService.updateBlogById(id, req.body);
        res.sendStatus(isUpdatedBlog ? HTTP_STATUSES.NO_CONTENT_204 : HTTP_STATUSES.NOT_FOUND_404);
    });


blogsRouter.post('/:blogId/posts',
    authMiddleware,
    CreatePostForBlogValidatorSchema,
    inputValidatorMiddlewares,
    async (req: RequestWithParamsBody<BlogCreatePostBlogURIParamsModel, BlogCreatePostForBlogModel>,
           res: Response<BlogWithCreatedPostViewModel>) => {

    const {blogId} = req.params;
    const {title, content, shortDescription} = req.body;

    const post = await postsService.createPost({blogId,title, content, shortDescription });

    if (!post) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    } else {
        res.status(HTTP_STATUSES.CREATED_201).send(post);
    }

});

blogsRouter.get('/:blogId/posts',
    async (req: RequestWithQueryParamsAndParams<BlogCreatePostBlogURIParamsModel, PostsGetModel>,
           res: Response<PostsForBlogViewModel>) => {

        const {blogId} = req.params;

        const searchBlog = await BlogsQueryRepository.getBlogById(blogId);

        if (!searchBlog) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
        
        const {
            pageNumber = 1,
            pageSize = 10,
            sortBy = 'createdAt',
            sortDirection = 'desc'
        } = req.query;
        const posts = await PostsQueryRepository.getPostsForBlog(pageNumber, pageSize, sortBy, sortDirection, blogId)

        if (!posts) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        } else {
            res.status(HTTP_STATUSES.OK_200).send(posts);
        }

    });
