import {Response, Router} from "express";
import {CommentViewModelType} from "../models/comments/CommentsViewModel";
import {RequestWithParams, RequestWithParamsBody} from "../types/types";
import {CommentsURIParamsModel} from "../models/comments/CommentsURIParamsModel";
import {commentsQueryRepository} from "../repositories/comments/comments-query-repository";
import {HTTP_STATUSES} from "../data/data";
import {authUserMiddleware} from "../middlewares/auth-user-middleware";
import {usersQueryRepository} from "../repositories/users/users-query-repository";
import {commentsService} from "../domains/comments/comments-service";
import {CreateCommentForPostSchema} from "../validator-schemas/create-comment-for-post-schema";
import {inputValidatorMiddlewares} from "../middlewares/input-validator-middlewares";
import {CommentsUpdateModel} from "../models/comments/CommentsUpdateModel";


class CommentsController {
    async getComments (
        req: RequestWithParams<CommentsURIParamsModel>,
        res: Response<CommentViewModelType>
    ) {
    const { id } = req.params;

    const comment = await commentsQueryRepository.getCommentById(id);

    if (!comment) {
        return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
    res.status(HTTP_STATUSES.OK_200).send(comment);
    }
    async deleteComment (
        req: RequestWithParams<CommentsURIParamsModel>,
        res: Response
    ) {
    const { id: commentId } = req.params;

    const comment = await commentsQueryRepository.getCommentById(commentId);

    if (!comment) {
        return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }

    const { id: userId } = req.user;

    const user = await usersQueryRepository.getUserById(userId);

    if (!user) {
        return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }

    if (comment.userId !== user.id) {
        return res.sendStatus(HTTP_STATUSES.FORBIDDEN_403);
    }

    const isDeletedComment = await commentsService.deleteComment(commentId);

    res.sendStatus(isDeletedComment ? HTTP_STATUSES.NO_CONTENT_204 : HTTP_STATUSES.NOT_FOUND_404);
    }
    async updateComment (
        req: RequestWithParamsBody<CommentsURIParamsModel, CommentsUpdateModel>,
        res: Response
    ) {
        const { id: commentId } = req.params;
        const { content } = req.body;

        const comment = await commentsQueryRepository.getCommentById(commentId);

        if (!comment) {
            return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }

        const { id: userId } = req.user;

        const user = await usersQueryRepository.getUserById(userId);

        if (!user) {
            return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }

        if (comment.userId !== user.id) {
            return res.sendStatus(HTTP_STATUSES.FORBIDDEN_403);
        }

        const isUpdatedComment = await commentsService.updateComment(commentId, content);

        return res.sendStatus(isUpdatedComment ? HTTP_STATUSES.NO_CONTENT_204: HTTP_STATUSES.NOT_FOUND_404);
    }
}

const commentsController = new CommentsController();

export const commentsRouter = Router({});


commentsRouter.get('/:id', commentsController.getComments);

commentsRouter.delete('/:id', authUserMiddleware, commentsController.deleteComment);

commentsRouter.put('/:id',
    authUserMiddleware,
    CreateCommentForPostSchema,
    inputValidatorMiddlewares,
    commentsController.updateComment
);
