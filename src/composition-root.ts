import "reflect-metadata";
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
import {Container} from "inversify";

export const container = new Container();

container.bind<TestingDataController>(TestingDataController).to(TestingDataController);
container.bind<TestingDataRepository>(TestingDataRepository).to(TestingDataRepository);

container.bind<BlogsController>(BlogsController).to(BlogsController);
container.bind<BlogsService>(BlogsService).to(BlogsService);
container.bind<BlogsQueryRepository>(BlogsQueryRepository).to(BlogsQueryRepository);
container.bind<BlogsRepository>(BlogsRepository).to(BlogsRepository);

container.bind<PostsController>(PostsController).to(PostsController);
container.bind<PostsService>(PostsService).to(PostsService);
container.bind<PostsRepository>(PostsRepository).to(PostsRepository);
container.bind<PostsQueryRepository>(PostsQueryRepository).to(PostsQueryRepository);

container.bind<UserController>(UserController).to(UserController);
container.bind<UsersQueryRepository>(UsersQueryRepository).to(UsersQueryRepository);
container.bind<UserService>(UserService).to(UserService);
container.bind<UsersRepository>(UsersRepository).to(UsersRepository);

container.bind<CommentsController>(CommentsController).to(CommentsController);
container.bind<CommentsService>(CommentsService).to(CommentsService);
container.bind<CommentsQueryRepository>(CommentsQueryRepository).to(CommentsQueryRepository);
container.bind<CommentsRepository>(CommentsRepository).to(CommentsRepository);

container.bind<AuthRouterController>(AuthRouterController).to(AuthRouterController);
container.bind<AuthService>(AuthService).to(AuthService);

container.bind<JwtService>(JwtService).to(JwtService);

container.bind<EmailsService>(EmailsService).to(EmailsService);
container.bind<EmailAdapter>(EmailAdapter).to(EmailAdapter);
