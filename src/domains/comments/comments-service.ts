import {CommentsRepository} from "../../repositories/comments/comments-repository";
import {Comment} from './classes';

export class CommentsService {

    constructor(protected commentsRepository: CommentsRepository) {}

    async createComment (content: string, userId: string, userLogin: string, postId: string) {

        const newComment = new Comment(content, userId, userLogin, postId);

        await this.commentsRepository.createCommentForPost(newComment);

        return {
            id: newComment.id,
            content,
            userId,
            userLogin,
            createdAt: newComment.createdAt
        }
    }
    async deleteComment (commentId: string): Promise<Boolean>  {
        const {deletedCount} =  await this.commentsRepository.deleteComment(commentId);
        return !!deletedCount;
    }
    async updateComment (commentId: string, content: string): Promise<Boolean> {
        const {matchedCount} =  await this.commentsRepository.updateComment(commentId, content);
        return !!matchedCount;
    }
}
