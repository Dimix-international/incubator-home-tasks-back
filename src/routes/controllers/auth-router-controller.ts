import {UsersQueryRepository} from "../../repositories/users/users-query-repository";
import {AuthService} from "../../domains/auth/auth-service";
import {RequestWithBody} from "../../types/types";
import {UserLoginModel} from "../../models/auth/UserLoginModel";
import {Response} from "express";
import {LoginViewModel} from "../../models/auth/LoginViewModel";
import {HTTP_STATUSES} from "../../data/data";

export class AuthRouterController {

    constructor(protected usersQueryRepository: UsersQueryRepository,
                protected authService: AuthService
    ) {
    }

    async login(req: RequestWithBody<UserLoginModel>, res: Response<LoginViewModel>) {
        const {loginOrEmail, password} = req.body;

        const user = await this.usersQueryRepository.getUserByEmailLogin(loginOrEmail);

        if (!user) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
            return;
        }
        const {id} = user;
        const userInfo = await this.authService.checkCredentials(password, user.password, {id});

        if (userInfo) {
            res.status(HTTP_STATUSES.OK_200).send(userInfo);
        } else {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
        }

    }
}