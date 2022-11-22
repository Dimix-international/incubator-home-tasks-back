import {BlogsQueryRepository} from "./repositories/blogs-repository/blogs-query-repository";
import {BlogsRepository} from "./repositories/blogs-repository/blogs-repository";
import {CommentsQueryRepository} from "./repositories/comments/comments-query-repository";
import {CommentsRepository} from "./repositories/comments/comments-repository";
import {PostsQueryRepository} from "./repositories/posts-repository/posts-query-repository";
import {PostsRepository} from "./repositories/posts-repository/posts-repository";
import {UsersQueryRepository} from "./repositories/users/users-query-repository";
import {UsersRepository} from "./repositories/users/users-repository";
import {JwtService} from "./domains/jwt/jwt-service";
import {AuthService} from "./domains/auth/auth-service";
import {AuthRouterController} from "./routes/controllers/auth-router-controller";
import {BlogsService} from "./domains/blogs/blogs-service";
import {PostsService} from "./domains/posts/posts-service";
import {BlogsController} from "./routes/controllers/blogs-controller";
import {CommentsService} from "./domains/comments/comments-service";
import {PostsController} from "./routes/controllers/posts-controller";
import {CommentsController} from "./routes/controllers/comments-controller";
import {UserController} from "./routes/controllers/user-controller";
import {UserService} from "./domains/users/user-service";
import {TestingDataRepository} from "./repositories/testing-data-repository";
import {TestingDataController} from "./routes/controllers/testing_data_controller";
import {EmailsService} from "./domains/emails/emails-service";
import {EmailAdapter} from "./adapters/email-adapter";


const blogsQueryRepository = new BlogsQueryRepository();
const blogsRepository = new BlogsRepository();

const commentsQueryRepository = new CommentsQueryRepository();
const commentsRepository = new CommentsRepository();
const testingDataRepository = new TestingDataRepository();

const postsQueryRepository = new PostsQueryRepository();
const postsRepository = new PostsRepository();

const usersQueryRepository = new UsersQueryRepository();
const usersRepository = new UsersRepository();

const jwtService = new JwtService();

const commentsService = new CommentsService(commentsRepository);

const authService = new AuthService(jwtService);
const userService = new UserService(usersRepository);
const blogsService = new BlogsService(blogsRepository);
const postsService = new PostsService(blogsQueryRepository, postsRepository);

const emailAdapter = new EmailAdapter();
const emailsService = new EmailsService(emailAdapter);

export const blogsController = new BlogsController(postsQueryRepository, postsService, blogsQueryRepository, blogsService);
export const authRouterController = new AuthRouterController(usersQueryRepository, authService, userService, emailsService);
export const postsController = new PostsController(postsQueryRepository, commentsQueryRepository, commentsService, postsService);
export const commentsController = new CommentsController(usersQueryRepository, commentsQueryRepository, commentsService);
export const usersController = new UserController(usersQueryRepository, userService);
export const testingDataController = new TestingDataController(testingDataRepository);