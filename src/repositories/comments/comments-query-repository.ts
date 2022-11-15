import {CommentsCollection} from "../db";

export const CommentsQueryRepository = {
    async getCommentById (id: string): Promise<CommentType | null> {
        return await CommentsCollection.findOne({id}, { projection: { _id: 0 }});
    }
}

type CommentType = {
    id: string;
    content: string;
    userId: string;
    userLogin: string;
    createdAt: Date
}