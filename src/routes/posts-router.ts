import {Request, Response, Router} from "express";
import {PostsViewModelType} from "../models/posts/PostsViewModelType";
import {HTTP_STATUSES} from "../data/data";
import {postsRepository} from "../repositories/posts-repository";
import {RequestWithBody, RequestWithParams, RequestWithParamsBody} from "../types/types";
import {PostsURIParamsModel} from "../models/posts/PostsURIParamsModel";
import {authMiddleware} from "../middlewares/auth-middleware";
import {PostValidatorSchema} from "../validator-schemas/post-validator-schema";
import {inputValidatorMiddlewares} from "../middlewares/input-validator-middlewares";
import {PostCreateModel} from "../models/posts/PostsCreateModel";
import {PostUpdateModel} from "../models/posts/PostsUpdateModel";


export const postsRouter = Router({});

postsRouter.get('/', (req: Request, res: Response<PostsViewModelType[]>) => {
    res.status(HTTP_STATUSES.OK_200).send(postsRepository.getPosts())
});

postsRouter.get('/:id', (req: RequestWithParams<PostsURIParamsModel>,  res: Response<PostsViewModelType>) => {
    const {id} = req.params

    const searchPost = postsRepository.getPostById(id);

    if (searchPost) {
        res.status(HTTP_STATUSES.OK_200).send(searchPost);
        return;
    }
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
})

postsRouter.post('/',
    authMiddleware,
    PostValidatorSchema,
    inputValidatorMiddlewares,
    (req: RequestWithBody<PostCreateModel>, res: Response<PostsViewModelType>) => {
        const newPost = postsRepository.createPost(req.body);
        res.status(HTTP_STATUSES.CREATED_201).send(newPost);
    }
)

postsRouter.delete('/:id',
    authMiddleware,
    (req: RequestWithParams<PostsURIParamsModel>, res: Response) => {
        const { id } = req.params;
        const isDeletedPost = postsRepository.deletePostById(id);
        res.sendStatus(isDeletedPost ? HTTP_STATUSES.NO_CONTENT_204 : HTTP_STATUSES.NOT_FOUND_404);
    }
 )

postsRouter.put('/:id',
    authMiddleware,
    PostValidatorSchema,
    inputValidatorMiddlewares,
    (req: RequestWithParamsBody<PostsURIParamsModel, PostUpdateModel>, res: Response) => {
        const { id } = req.params;
        const isUpdatedPost = postsRepository.updatePostById(id, req.body);
        res.sendStatus(isUpdatedPost ? HTTP_STATUSES.NO_CONTENT_204 : HTTP_STATUSES.NOT_FOUND_404);
    }
)