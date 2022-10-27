import {Request, Response, Router} from "express";
import {BlogViewModel} from "../models/blogs/BlogViewModel";
import {HTTP_STATUSES} from "../data/data";
import {RequestWithBody, RequestWithParams, RequestWithParamsBody} from "../types/types";
import {BlogURIParamsModel} from "../models/blogs/BlogURIParamsModel";
import {BlogsValidatorSchema} from "../validator-schemas/blogs-validator-schema";
import {inputValidatorMiddlewares} from "../middlewares/input-validator-middlewares";
import {BlogCreateModel} from "../models/blogs/BlogCreateModel";
import {authMiddleware} from "../middlewares/auth-middleware";
import {BlogUpdateModel} from "../models/blogs/BlogUpdateModel";
import {BlogsService} from "../domains/blogs-service";


export const blogsRouter = Router({});

blogsRouter.get('/', async (req: Request, res: Response<BlogViewModel[]>) => {
    const blogs = await BlogsService.getBlogs();
    res.status(HTTP_STATUSES.OK_200).send(blogs);
});

blogsRouter.get('/:id', async (req: RequestWithParams<BlogURIParamsModel>, res: Response<BlogViewModel>) => {

    const { id } = req.params;

    const searchedBlog = await BlogsService.getBlogById(id);

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