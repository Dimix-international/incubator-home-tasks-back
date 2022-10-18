import {Router, Request, Response} from "express";
import {BlogViewModel} from "../models/blogs/BlogViewModel";
import {HTTP_STATUSES} from "../data/data";
import {BlogsRepository} from "../repositories/blogs-repository";
import {RequestWithBody, RequestWithParams} from "../types/types";
import {BlogURIParamsModel} from "../models/blogs/BlogURIParamsModel";
import {BlogsValidatorSchema} from "../validator-schemas/blogs-validator-schema";
import {inputValidatorMiddlewares} from "../middlewares/input-validator-middlewares";
import {BlogCreateModel} from "../models/blogs/BlogCreateModel";
import {authMiddleware} from "../middlewares/auth-middleware";


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
})