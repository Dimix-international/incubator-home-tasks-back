import {UsersQueryRepository} from "../../repositories/users/users-query-repository";
import {UserService} from "../../domains/users/user-service";
import {RequestWithBody, RequestWithParams, RequestWithQuery} from "../../types/types";
import {UsersGetModel} from "../../models/users/UsersGetModel";
import {Response} from "express";
import {UsersViewModelType, UserViewModelType} from "../../models/users/UsersViewModelType";
import {transformInNumber} from "../../helpers/helpers";
import {HTTP_STATUSES} from "../../data/data";
import {UserCreateModel} from "../../models/users/UserCreateModel";
import {UsersURIParamsModel} from "../../models/users/UsersURIParamsModel";
import {inject, injectable} from "inversify";

@injectable()
export class UserController {

    constructor(@inject(UsersQueryRepository) protected usersQueryRepository: UsersQueryRepository,
                @inject(UserService) protected userService: UserService) {
    }

    async getUsers(req: RequestWithQuery<UsersGetModel>, res: Response<UsersViewModelType>) {
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

    async createUser(req: RequestWithBody<UserCreateModel>, res: Response<UserViewModelType>) {
        const {login, email, password} = req.body;

        const newUser = await this.userService.createUser(login, password, email);
        res.status(HTTP_STATUSES.CREATED_201).send(newUser);
    }

    async deleteUser(req: RequestWithParams<UsersURIParamsModel>, res: Response) {
        const {id} = req.params;

        const searchUser = await this.usersQueryRepository.getUserById(id);

        if (!searchUser) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }

        const isDeletedPost = await this.userService.deleteUserById(id);
        res.sendStatus(isDeletedPost ? HTTP_STATUSES.NO_CONTENT_204 : HTTP_STATUSES.NOT_FOUND_404);
    }
}