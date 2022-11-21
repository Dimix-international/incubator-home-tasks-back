import {Router} from "express";
import {authUserMiddleware} from "../middlewares/auth-user-middleware";
import {CreateCommentForPostSchema} from "../validator-schemas/create-comment-for-post-schema";
import {inputValidatorMiddlewares} from "../middlewares/input-validator-middlewares";
import {commentsController} from "../composition-root";


export const commentsRouter = Router({});


commentsRouter.get('/:id', commentsController.getComments.bind(commentsController));

commentsRouter.delete('/:id', authUserMiddleware, commentsController.deleteComment.bind(commentsController));

commentsRouter.put('/:id',
    authUserMiddleware,
    CreateCommentForPostSchema,
    inputValidatorMiddlewares,
    commentsController.updateComment.bind(commentsController)
);
