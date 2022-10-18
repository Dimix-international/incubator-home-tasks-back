import {Request, Response, Router} from "express";
import {BlogViewModel} from "../models/blogs/BlogViewModel";
import {HTTP_STATUSES} from "../data/data";
import {BlogsRepository} from "../repositories/blogs-repository";
import {RequestWithBody, RequestWithParams, RequestWithParamsBody} from "../types/types";
import {BlogURIParamsModel} from "../models/blogs/BlogURIParamsModel";
import {BlogsValidatorSchema} from "../validator-schemas/blogs-validator-schema";
import {inputValidatorMiddlewares} from "../middlewares/input-validator-middlewares";
import {BlogCreateModel} from "../models/blogs/BlogCreateModel";
import {authMiddleware} from "../middlewares/auth-middleware";
import {BlogUpdateModel} from "../models/blogs/BlogUpdateModel";


export const blogsRouter = Router({});

blogsRouter.get('/', (req: Request, res: Response<BlogViewModel[]>) => {
    res.status(HTTP_STATUSES.OK_200).send(BlogsRepository.getBlogs());
});

blogsRouter.get('/:id', (req: RequestWithParams<BlogURIParamsModel>, res: Response<BlogViewModel>) => {

    const { id } = req.params;

    const searchedBlog = BlogsRepository.getBlogById(id);

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
    (req: RequestWithBody<BlogCreateModel>, res: Response<BlogViewModel>) => {

    const newBlog = BlogsRepository.createBlog(req.body);
    res.status(HTTP_STATUSES.CREATED_201).send(newBlog);
});

blogsRouter.delete('/:id', authMiddleware, (req:RequestWithParams<BlogURIParamsModel>, res: Response) => {
    const { id } = req.params;
    const isDeletedBlog = BlogsRepository.deleteBlogById(id);
    res.sendStatus(isDeletedBlog ? HTTP_STATUSES.NO_CONTENT_204 : HTTP_STATUSES.NOT_FOUND_404);
});

blogsRouter.put('/:id',
    authMiddleware,
    BlogsValidatorSchema,
    inputValidatorMiddlewares,
    (req: RequestWithParamsBody<BlogURIParamsModel, BlogUpdateModel>, res: Response) => {
        const { id } = req.params;
        const isUpdatedBlog = BlogsRepository.updateBlogById(id, req.body);
        res.send(isUpdatedBlog ? HTTP_STATUSES.NO_CONTENT_204 : HTTP_STATUSES.NOT_FOUND_404);
    });