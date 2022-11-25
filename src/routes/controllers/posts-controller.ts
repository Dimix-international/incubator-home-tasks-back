import {PostsQueryRepository} from "../../repositories/posts-repository/posts-query-repository";
import {CommentsQueryRepository} from "../../repositories/comments/comments-query-repository";
import {CommentsService} from "../../domains/comments/comments-service";
import {PostsService} from "../../domains/posts/posts-service";
import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsBody,
    RequestWithQuery,
    RequestWithQueryParamsAndParams
} from "../../types/types";
import {PostsGetModel} from "../../models/posts/PostsGetModel";
import {Response} from "express";
import {PostsViewModelType, PostViewModelType} from "../../models/posts/PostsViewModelType";
import {transformInNumber} from "../../helpers/helpers";
import {HTTP_STATUSES} from "../../data/data";
import {PostsURIParamsModel} from "../../models/posts/PostsURIParamsModel";
import {PostCreateModel} from "../../models/posts/PostsCreateModel";
import {PostUpdateModel} from "../../models/posts/PostsUpdateModel";
import {PostsCreateComment} from "../../models/posts/PostsCreateComment";
import {CommentsViewModel, CommentViewModelType} from "../../models/comments/CommentsViewModel";
import {CommentsGetModel} from "../../models/comments/CommentsGetModel";
import {inject, injectable} from "inversify";

@injectable()
export class PostsController {

    constructor(@inject(PostsQueryRepository) protected postsQueryRepository: PostsQueryRepository,
                @inject(CommentsQueryRepository) protected commentsQueryRepository: CommentsQueryRepository,
                @inject(CommentsService) protected commentsService: CommentsService,
                @inject(PostsService) protected postsService: PostsService,
    ) {
    }

    async getPosts(req: RequestWithQuery<PostsGetModel>, res: Response<PostsViewModelType>) {
        const {
            pageNumber,
            pageSize,
            sortBy = 'createdAt',
            sortDirection = 'desc'
        } = req.query;

        const posts = await this.postsQueryRepository.getPosts(
            transformInNumber(pageNumber, 1),
            transformInNumber(pageSize, 10),
            sortBy,
            sortDirection,
        );
        res.status(HTTP_STATUSES.OK_200).send(posts);
    }

    async getPost(req: RequestWithParams<PostsURIParamsModel>, res: Response<PostViewModelType>) {
        const {id} = req.params

        const searchPost = await this.postsQueryRepository.getPostById(id);

        if (searchPost) {
            res.status(HTTP_STATUSES.OK_200).send(searchPost);
            return;
        }
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }

    async createPost(req: RequestWithBody<PostCreateModel>, res: Response<PostViewModelType>) {
        const newPost = await this.postsService.createPost(req.body) as PostViewModelType;
        res.status(HTTP_STATUSES.CREATED_201).send(newPost);
    }

    async deletePost(req: RequestWithParams<PostsURIParamsModel>, res: Response) {
        const {id} = req.params;
        const isDeletedPost = await this.postsService.deletePostById(id);
        res.sendStatus(isDeletedPost ? HTTP_STATUSES.NO_CONTENT_204 : HTTP_STATUSES.NOT_FOUND_404);
    }

    async updatePost(req: RequestWithParamsBody<PostsURIParamsModel, PostUpdateModel>, res: Response) {
        const {id} = req.params;
        const isUpdatedPost = await this.postsService.updatePostById(id, req.body);
        res.sendStatus(isUpdatedPost ? HTTP_STATUSES.NO_CONTENT_204 : HTTP_STATUSES.NOT_FOUND_404);
    }

    async createCommentForPost(
        req: RequestWithParamsBody<PostsURIParamsModel, PostsCreateComment>,
        res: Response<CommentViewModelType>) {
        const {id: postId} = req.params;
        const {content} = req.body;

        const post = await this.postsQueryRepository.getPostById(postId);
        if (!post) {
            return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }

        const {id: userId, login: userLogin} = req.user;
        const newComment = await this.commentsService.createComment(content, userId, userLogin, postId);
        res.status(HTTP_STATUSES.CREATED_201).send(newComment)
    }

    async getCommentsForPost(
        req: RequestWithQueryParamsAndParams<PostsURIParamsModel, CommentsGetModel>,
        res: Response<CommentsViewModel>) {

        const {id: postId} = req.params;
        const {
            pageNumber,
            pageSize,
            sortBy = 'createdAt',
            sortDirection = 'desc'
        } = req.query;

        const post = await this.postsQueryRepository.getPostById(postId);

        if (!post) {
            return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }

        const comments = await this.commentsQueryRepository.getComments(
            postId,
            transformInNumber(pageNumber, 1),
            transformInNumber(pageSize, 10),
            sortBy,
            sortDirection,
        );

        res.status(HTTP_STATUSES.OK_200).send(comments);

    }
}