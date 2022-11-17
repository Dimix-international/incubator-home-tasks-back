import {Response, Router} from "express";
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
import {blogsService} from "../domains/blogs/blogs-service";
import {blogsQueryRepository} from "../repositories/blogs-repository/blogs-query-repository";
import {BlogsGetModel} from "../models/blogs/BlogsGetModel";
import {BlogCreatePostBlogURIParamsModel} from "../models/blogs/BlogCreatePostBlogURIParamsModel";
import {BlogCreatePostForBlogModel} from "../models/blogs/BlogCreatePostForBlogModel";
import {BlogWithCreatedPostViewModel} from "../models/blogs/BlogWithCreatedPostViewModel";
import {CreatePostForBlogValidatorSchema} from "../validator-schemas/create-post-for-blog-validator-schema";
import {postsService} from "../domains/posts/posts-service";
import {postsQueryRepository} from "../repositories/posts-repository/posts-query-repository";
import {PostsGetModel} from "../models/posts/PostsGetModel";
import {transformInNumber} from "../helpers/helpers";

class BlogsController {
    async getBlogs (req: RequestWithQuery<BlogsGetModel>, res: Response<BlogsViewModel>) {
    const {
        searchNameTerm = null,
        pageNumber ,
        pageSize,
        sortBy = 'createdAt',
        sortDirection = 'desc'
    } = req.query;

    const blogs = await blogsQueryRepository.getBlogs(
        searchNameTerm,
        transformInNumber(pageNumber, 1),
        transformInNumber(pageSize, 10),
        sortBy,
        sortDirection,
    );
    res.status(HTTP_STATUSES.OK_200).send(blogs);
    }
    async getBlog (req: RequestWithParams<BlogURIParamsModel>, res: Response<BlogViewModel>) {
        const { id } = req.params;

        const searchedBlog = await blogsQueryRepository.getBlogById(id);

        if (searchedBlog) {
            res.status(HTTP_STATUSES.OK_200).send(searchedBlog);
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }
    }
    async createBlog (req: RequestWithBody<BlogCreateModel>, res: Response<BlogViewModel>) {
        const newBlog = await blogsService.createBlog(req.body) as BlogViewModel;
        res.status(HTTP_STATUSES.CREATED_201).send(newBlog);
    }
    async deleteBlog (req:RequestWithParams<BlogURIParamsModel>, res: Response) {
        const { id } = req.params;
        const isDeletedBlog = await blogsService.deleteBlogById(id);
        res.sendStatus(isDeletedBlog ? HTTP_STATUSES.NO_CONTENT_204 : HTTP_STATUSES.NOT_FOUND_404);
    }
    async updateBlog (req: RequestWithParamsBody<BlogURIParamsModel, BlogUpdateModel>, res: Response) {
        const { id } = req.params;
        const isUpdatedBlog = await blogsService.updateBlogById(id, req.body);
        res.sendStatus(isUpdatedBlog ? HTTP_STATUSES.NO_CONTENT_204 : HTTP_STATUSES.NOT_FOUND_404);
    }
    async createPostForBlog (req: RequestWithParamsBody<BlogCreatePostBlogURIParamsModel, BlogCreatePostForBlogModel>,
                             res: Response<BlogWithCreatedPostViewModel>) {

    const {blogId} = req.params;
    const {title, content, shortDescription} = req.body;

    const post = await postsService.createPost({blogId,title, content, shortDescription });

    if (!post) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    res.status(HTTP_STATUSES.CREATED_201).send(post);

    }
    async getPostOfBlog (req: RequestWithQueryParamsAndParams<BlogCreatePostBlogURIParamsModel, PostsGetModel>,
                         res: Response<PostsForBlogViewModel>) {

    const {blogId} = req.params;

    const searchBlog = await blogsQueryRepository.getBlogById(blogId);

    if (!searchBlog) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }

    const {
        pageNumber,
        pageSize,
        sortBy = 'createdAt',
        sortDirection = 'desc'
    } = req.query;

    const posts = await postsQueryRepository.getPostsForBlog(
        transformInNumber(pageNumber, 1),
        transformInNumber(pageSize, 10),
        sortBy,
        sortDirection,
        blogId
    );

    if (!posts) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }

    res.status(HTTP_STATUSES.OK_200).send(posts);

    }
}

const blogsController = new BlogsController();

export const blogsRouter = Router({});

blogsRouter.get('/', blogsController.getBlogs);

blogsRouter.get('/:id', blogsController.getBlog);

blogsRouter.post('/',
    authMiddleware,
    BlogsValidatorSchema,
    inputValidatorMiddlewares,
    blogsController.createBlog
);

blogsRouter.delete('/:id', authMiddleware, blogsController.deleteBlog);

blogsRouter.put('/:id',
    authMiddleware,
    BlogsValidatorSchema,
    inputValidatorMiddlewares,
    blogsController.updateBlog
);


blogsRouter.post('/:blogId/posts',
    authMiddleware,
    CreatePostForBlogValidatorSchema,
    inputValidatorMiddlewares,
    blogsController.createPostForBlog
);

blogsRouter.get('/:blogId/posts', blogsController.getPostOfBlog);

