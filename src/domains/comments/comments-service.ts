import {commentsRepository} from "../../repositories/comments/comments-repository";
import {Comment} from './classes';

class CommentsService {
    async createComment (content: string, userId: string, userLogin: string, postId: string) {


        const newComment = new Comment(content, userId, userLogin, postId);

        await commentsRepository.createCommentForPost(newComment);

        return {
            id: newComment.id,
            content,
            userId,
            userLogin,
            createdAt: newComment.createdAt
        }
    }
    async deleteComment (commentId: string): Promise<Boolean>  {
        const {deletedCount} =  await commentsRepository.deleteComment(commentId);
        return !!deletedCount;
    }
    async updateComment (commentId: string, content: string): Promise<Boolean> {
        const {matchedCount} =  await commentsRepository.updateComment(commentId, content);
        return !!matchedCount;
    }
}

export const commentsService = new CommentsService();