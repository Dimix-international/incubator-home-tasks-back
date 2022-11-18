import {Response, Router} from "express";
import {RequestWithBody, RequestWithParams, RequestWithQuery} from "../types/types";
import {HTTP_STATUSES} from "../data/data";
import {UsersGetModel} from "../models/users/UsersGetModel";
import {UsersViewModelType, UserViewModelType} from "../models/users/UsersViewModelType";
import {authMiddleware} from "../middlewares/auth-middleware";
import {UsersQueryRepository} from "../repositories/users/users-query-repository";
import {transformInNumber} from "../helpers/helpers";
import {UsersURIParamsModel} from "../models/users/UsersURIParamsModel";
import {UserService} from "../domains/users/user-service";
import {inputValidatorMiddlewares} from "../middlewares/input-validator-middlewares";
import {UserValidatorSchema} from "../validator-schemas/user-validator-schema";
import {UserCreateModel} from "../models/users/UserCreateModel";

class UserController {

    private usersQueryRepository: UsersQueryRepository;
    private userService: UserService

    constructor() {
        this.usersQueryRepository = new UsersQueryRepository();
        this.userService = new UserService();
    }

    async getUsers (req: RequestWithQuery<UsersGetModel>, res: Response<UsersViewModelType>) {
        const {
            pageNumber,
            pageSize,
            sortBy = 'createdAt',
            sortDirection = 'desc',
            searchLoginTerm = null,
            searchEmailTerm = null
        } = req.query;

        const users = await this.usersQueryRepository.getUsers(
            transformInNumber(pageNumber, 1),
            transformInNumber(pageSize, 10),
            sortBy,
            sortDirection,
            searchLoginTerm,
            searchEmailTerm
        )

        res.status(HTTP_STATUSES.OK_200).send(users);
    }
    async createUser (req: RequestWithBody<UserCreateModel>, res: Response<UserViewModelType>) {
        const {login, email, password} = req.body;

        const newUser = await this.userService.createUser(login, password, email) as UserViewModelType;
        res.status(HTTP_STATUSES.CREATED_201).send(newUser);
    }
    async deleteUser (req: RequestWithParams<UsersURIParamsModel>, res: Response) {
        const { id } = req.params;

        const searchUser = await this.usersQueryRepository.getUserById(id);

        if (!searchUser) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }

        const isDeletedPost = await this.userService.deleteUserById(id);
        res.sendStatus(isDeletedPost ? HTTP_STATUSES.NO_CONTENT_204 : HTTP_STATUSES.NOT_FOUND_404);
    }
}

const usersController = new UserController();


export const usersRouter = Router({});

usersRouter.get(
    '/',
    authMiddleware,
    usersController.getUsers.bind(usersController)
);

usersRouter.post('/',
    authMiddleware,
    UserValidatorSchema,
    inputValidatorMiddlewares,
    usersController.createUser.bind(usersController)
)

usersRouter.delete('/:id',
    authMiddleware,
    usersController.deleteUser.bind(usersController)
)