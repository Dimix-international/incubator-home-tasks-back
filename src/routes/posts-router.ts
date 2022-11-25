import {Router} from "express";
import {authMiddleware} from "../middlewares/auth-middleware";
import {PostValidatorSchema} from "../validator-schemas/post-validator-schema";
import {inputValidatorMiddlewares} from "../middlewares/input-validator-middlewares";
import {CreateCommentForPostSchema} from "../validator-schemas/create-comment-for-post-schema";
import {authUserMiddleware} from "../middlewares/auth-user-middleware";
import {container} from "../composition-root";
import {PostsController} from "./controllers/posts-controller";

const postsController = container.resolve(PostsController);

export const postsRouter = Router({});

postsRouter.get('/', postsController.getPosts.bind(postsController));

postsRouter.get('/:id', postsController.getPost.bind(postsController))

postsRouter.post('/',
    authMiddleware,
    PostValidatorSchema,
    inputValidatorMiddlewares,
    postsController.createPost.bind(postsController)
)

postsRouter.delete('/:id',
    authMiddleware,
    postsController.deletePost.bind(postsController)
 )

postsRouter.put('/:id',
    authMiddleware,
    PostValidatorSchema,
    inputValidatorMiddlewares,
    postsController.updatePost.bind(postsController)
)

postsRouter.post('/:id/comments',
    authUserMiddleware,
    CreateCommentForPostSchema,
    inputValidatorMiddlewares,
    postsController.createCommentForPost.bind(postsController)
)

postsRouter.get('/:id/comments',postsController.getCommentsForPost.bind(postsController))