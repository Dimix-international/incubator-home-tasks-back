import {PostsQueryRepository} from "../../repositories/posts-repository/posts-query-repository";
import {PostsService} from "../../domains/posts/posts-service";
import {BlogsQueryRepository} from "../../repositories/blogs-repository/blogs-query-repository";
import {BlogsService} from "../../domains/blogs/blogs-service";
import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsBody,
    RequestWithQuery,
    RequestWithQueryParamsAndParams
} from "../../types/types";
import {BlogsGetModel} from "../../models/blogs/BlogsGetModel";
import {Response} from "express";
import {BlogsViewModel, BlogViewModel, PostsForBlogViewModel} from "../../models/blogs/BlogViewModel";
import {transformInNumber} from "../../helpers/helpers";
import {HTTP_STATUSES} from "../../data/data";
import {BlogURIParamsModel} from "../../models/blogs/BlogURIParamsModel";
import {BlogCreateModel} from "../../models/blogs/BlogCreateModel";
import {BlogUpdateModel} from "../../models/blogs/BlogUpdateModel";
import {BlogCreatePostBlogURIParamsModel} from "../../models/blogs/BlogCreatePostBlogURIParamsModel";
import {BlogCreatePostForBlogModel} from "../../models/blogs/BlogCreatePostForBlogModel";
import {BlogWithCreatedPostViewModel} from "../../models/blogs/BlogWithCreatedPostViewModel";
import {PostsGetModel} from "../../models/posts/PostsGetModel";
import {inject, injectable} from "inversify";

@injectable()
export class BlogsController {

    constructor(@inject(PostsQueryRepository) protected postsQueryRepository: PostsQueryRepository,
                @inject(PostsService) protected postsService: PostsService,
                @inject(BlogsQueryRepository) protected blogsQueryRepository: BlogsQueryRepository,
                @inject(BlogsService) protected blogsService: BlogsService,
    ) {
    }

    async getBlogs(req: RequestWithQuery<BlogsGetModel>, res: Response<BlogsViewModel>) {
        const {
            searchNameTerm = null,
            pageNumber,
            pageSize,
            sortBy = 'createdAt',
            sortDirection = 'desc'
        } = req.query;

        const blogs = await this.blogsQueryRepository.getBlogs(
            searchNameTerm,
            transformInNumber(pageNumber, 1),
            transformInNumber(pageSize, 10),
            sortBy,
            sortDirection,
        );
        res.status(HTTP_STATUSES.OK_200).send(blogs);
    }

    async getBlog(req: RequestWithParams<BlogURIParamsModel>, res: Response<BlogViewModel>) {
        const {id} = req.params;

        const searchedBlog = await this.blogsQueryRepository.getBlogById(id);

        if (searchedBlog) {
            res.status(HTTP_STATUSES.OK_200).send(searchedBlog);
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }
    }

    async createBlog(req: RequestWithBody<BlogCreateModel>, res: Response<BlogViewModel>) {
        const newBlog = await this.blogsService.createBlog(req.body) as BlogViewModel;
        res.status(HTTP_STATUSES.CREATED_201).send(newBlog);
    }

    async deleteBlog(req: RequestWithParams<BlogURIParamsModel>, res: Response) {
        const {id} = req.params;
        const isDeletedBlog = await this.blogsService.deleteBlogById(id);
        res.sendStatus(isDeletedBlog ? HTTP_STATUSES.NO_CONTENT_204 : HTTP_STATUSES.NOT_FOUND_404);
    }

    async updateBlog(req: RequestWithParamsBody<BlogURIParamsModel, BlogUpdateModel>, res: Response) {
        const {id} = req.params;
        const isUpdatedBlog = await this.blogsService.updateBlogById(id, req.body);
        res.sendStatus(isUpdatedBlog ? HTTP_STATUSES.NO_CONTENT_204 : HTTP_STATUSES.NOT_FOUND_404);
    }

    async createPostForBlog(req: RequestWithParamsBody<BlogCreatePostBlogURIParamsModel, BlogCreatePostForBlogModel>,
                            res: Response<BlogWithCreatedPostViewModel>) {

        const {blogId} = req.params;
        const {title, content, shortDescription} = req.body;

        const post = await this.postsService.createPost({blogId, title, content, shortDescription});

        if (!post) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }
        res.status(HTTP_STATUSES.CREATED_201).send(post);

    }

    async getPostOfBlog(req: RequestWithQueryParamsAndParams<BlogCreatePostBlogURIParamsModel, PostsGetModel>,
                        res: Response<PostsForBlogViewModel>) {

        const {blogId} = req.params;

        const searchBlog = await this.blogsQueryRepository.getBlogById(blogId);

        if (!searchBlog) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }

        const {
            pageNumber,
            pageSize,
            sortBy = 'createdAt',
            sortDirection = 'desc'
        } = req.query;

        const posts = await this.postsQueryRepository.getPostsForBlog(
            transformInNumber(pageNumber, 1),
            transformInNumber(pageSize, 10),
            sortBy,
            sortDirection,
            blogId
        );

        if (!posts) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }

        res.status(HTTP_STATUSES.OK_200).send(posts);

    }
}