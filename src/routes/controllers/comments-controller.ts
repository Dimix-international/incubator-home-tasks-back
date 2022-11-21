import {UsersQueryRepository} from "../../repositories/users/users-query-repository";
import {CommentsQueryRepository} from "../../repositories/comments/comments-query-repository";
import {CommentsService} from "../../domains/comments/comments-service";
import {RequestWithParams, RequestWithParamsBody} from "../../types/types";
import {CommentsURIParamsModel} from "../../models/comments/CommentsURIParamsModel";
import {Response} from "express";
import {CommentViewModelType} from "../../models/comments/CommentsViewModel";
import {HTTP_STATUSES} from "../../data/data";
import {CommentsUpdateModel} from "../../models/comments/CommentsUpdateModel";

export class CommentsController {

    constructor(protected usersQueryRepository: UsersQueryRepository,
                protected commentsQueryRepository: CommentsQueryRepository,
                protected commentsService: CommentsService) {
    }

    async getComments(
        req: RequestWithParams<CommentsURIParamsModel>,
        res: Response<CommentViewModelType>
    ) {
        const {id} = req.params;

        const comment = await this.commentsQueryRepository.getCommentById(id);

        if (!comment) {
            return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }
        res.status(HTTP_STATUSES.OK_200).send(comment);
    }

    async deleteComment(
        req: RequestWithParams<CommentsURIParamsModel>,
        res: Response
    ) {
        const {id: commentId} = req.params;

        const comment = await this.commentsQueryRepository.getCommentById(commentId);

        if (!comment) {
            return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }

        const {id: userId} = req.user;

        const user = await this.usersQueryRepository.getUserById(userId);

        if (!user) {
            return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }

        if (comment.userId !== user.id) {
            return res.sendStatus(HTTP_STATUSES.FORBIDDEN_403);
        }

        const isDeletedComment = await this.commentsService.deleteComment(commentId);

        res.sendStatus(isDeletedComment ? HTTP_STATUSES.NO_CONTENT_204 : HTTP_STATUSES.NOT_FOUND_404);
    }

    async updateComment(
        req: RequestWithParamsBody<CommentsURIParamsModel, CommentsUpdateModel>,
        res: Response
    ) {
        const {id: commentId} = req.params;
        const {content} = req.body;

        const comment = await this.commentsQueryRepository.getCommentById(commentId);

        if (!comment) {
            return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }

        const {id: userId} = req.user;

        const user = await this.usersQueryRepository.getUserById(userId);

        if (!user) {
            return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }

        if (comment.userId !== user.id) {
            return res.sendStatus(HTTP_STATUSES.FORBIDDEN_403);
        }

        const isUpdatedComment = await this.commentsService.updateComment(commentId, content);

        return res.sendStatus(isUpdatedComment ? HTTP_STATUSES.NO_CONTENT_204 : HTTP_STATUSES.NOT_FOUND_404);
    }
}