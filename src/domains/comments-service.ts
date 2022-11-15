import {v4 as uuidv4} from "uuid";
import {commentsRepository} from "../repositories/comments/comments-repository";

export const commentsService = {
    async createComment (content: string, userId: string, userLogin: string) {

        const newComment = {
            id: uuidv4(),
            content,
            userId,
            userLogin,
            createdAt: new Date()
        }

        await commentsRepository.createCommentForPost(newComment);

        return {
            id: newComment.id,
            content,
            userId,
            userLogin,
            createdAt:newComment.createdAt
        }
    },
    async deleteComment (commentId: string): Promise<Boolean>  {
       const {deletedCount} =  await commentsRepository.deleteComment(commentId);
       return !!deletedCount;
    },

    async updateComment (commentId: string, content: string): Promise<Boolean> {
       const {matchedCount} =  await commentsRepository.updateComment(commentId, content);
       return !!matchedCount;
    }
}