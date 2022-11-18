import {Response, Router} from "express";
import {RequestWithBody} from "../types/types";
import {UserLoginModel} from "../models/auth/UserLoginModel";
import {AuthService} from "../domains/auth/auth-service";
import {HTTP_STATUSES} from "../data/data";
import {UsersQueryRepository} from "../repositories/users/users-query-repository";
import {LoginViewModel} from "../models/auth/LoginViewModel";


class AuthRouterController {
    private usersQueryRepository: UsersQueryRepository;
    private authService: AuthService;

    constructor() {
        this.usersQueryRepository = new UsersQueryRepository();
        this.authService = new AuthService();
    }

    async login (req: RequestWithBody<UserLoginModel>, res: Response<LoginViewModel>) {
        const {login, password} = req.body;

        const user = await this.usersQueryRepository.getUserByLogin(login);

        if (!user) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
            return;
        }
        const { id } = user;
        const userInfo = await this.authService.checkCredentials(password, user.password, {id});

        if (userInfo) {
            res.status(HTTP_STATUSES.OK_200).send(userInfo);
        } else {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
        }

    }
}

const authRouterController = new AuthRouterController();

export const authRouter = Router({});

authRouter.post('/login', authRouterController.login.bind(authRouterController));