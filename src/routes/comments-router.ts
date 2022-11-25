import {Router} from "express";
import {authUserMiddleware} from "../middlewares/auth-user-middleware";
import {CreateCommentForPostSchema} from "../validator-schemas/create-comment-for-post-schema";
import {inputValidatorMiddlewares} from "../middlewares/input-validator-middlewares";
import {container} from "../composition-root";
import {CommentsController} from "./controllers/comments-controller";

const commentsController = container.resolve(CommentsController);

export const commentsRouter = Router({});


commentsRouter.get('/:id', commentsController.getComments.bind(commentsController));

commentsRouter.delete('/:id', authUserMiddleware, commentsController.deleteComment.bind(commentsController));

commentsRouter.put('/:id',
    authUserMiddleware,
    CreateCommentForPostSchema,
    inputValidatorMiddlewares,
    commentsController.updateComment.bind(commentsController)
);
