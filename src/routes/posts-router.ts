import {Request, Response, Router} from "express";
import {PostsViewModelType} from "../models/posts/PostsViewModelType";
import {HTTP_STATUSES} from "../data/data";
import {RequestWithBody, RequestWithParams, RequestWithParamsBody} from "../types/types";
import {PostsURIParamsModel} from "../models/posts/PostsURIParamsModel";
import {authMiddleware} from "../middlewares/auth-middleware";
import {PostValidatorSchema} from "../validator-schemas/post-validator-schema";
import {inputValidatorMiddlewares} from "../middlewares/input-validator-middlewares";
import {PostCreateModel} from "../models/posts/PostsCreateModel";
import {PostUpdateModel} from "../models/posts/PostsUpdateModel";
import {postsService} from "../domains/posts-service";
import {PostsQueryRepository} from "../repositories/posts-repository/posts-query-repository";


export const postsRouter = Router({});

postsRouter.get('/', async (req: Request, res: Response<PostsViewModelType[]>) => {
    const posts = await PostsQueryRepository.getPosts();
    res.status(HTTP_STATUSES.OK_200).send(posts);
});

postsRouter.get('/:id', async (req: RequestWithParams<PostsURIParamsModel>,  res: Response<PostsViewModelType>) => {
    const {id} = req.params

    const searchPost = await PostsQueryRepository.getPostById(id);

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
    async (req: RequestWithBody<PostCreateModel>, res: Response<PostsViewModelType>) => {
        const newPost = await postsService.createPost(req.body) as PostsViewModelType;
        res.status(HTTP_STATUSES.CREATED_201).send(newPost);
    }
)

postsRouter.delete('/:id',
    authMiddleware,
    async (req: RequestWithParams<PostsURIParamsModel>, res: Response) => {
        const { id } = req.params;
        const isDeletedPost = await postsService.deletePostById(id);
        res.sendStatus(isDeletedPost ? HTTP_STATUSES.NO_CONTENT_204 : HTTP_STATUSES.NOT_FOUND_404);
    }
 )

postsRouter.put('/:id',
    authMiddleware,
    PostValidatorSchema,
    inputValidatorMiddlewares,
    async (req: RequestWithParamsBody<PostsURIParamsModel, PostUpdateModel>, res: Response) => {
        const { id } = req.params;
        const isUpdatedPost = await postsService.updatePostById(id, req.body);
        res.sendStatus(isUpdatedPost ? HTTP_STATUSES.NO_CONTENT_204 : HTTP_STATUSES.NOT_FOUND_404);
    }
)