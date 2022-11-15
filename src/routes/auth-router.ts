import {Response, Router} from "express";
import {RequestWithBody} from "../types/types";
import {UserLoginModel} from "../models/auth/UserLoginModel";
import {authService} from "../domains/auth-service";
import {HTTP_STATUSES} from "../data/data";
import {UsersQueryRepository, UserType} from "../repositories/users/users-query-repository";
import {LoginViewModel} from "../models/auth/LoginViewModel";


export const authRouter = Router({});

authRouter.post('/login',
    async (req: RequestWithBody<UserLoginModel>, res: Response<LoginViewModel>) => {
        const {login, password} = req.body;

        const user = await UsersQueryRepository.getUserByLogin(login);

        if (!user) {
          res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
          return;
        }
        const { id } = user;
        const userInfo = await authService.checkCredentials(password, user.password, {id});

        if (userInfo) {
            res.status(HTTP_STATUSES.OK_200).send(userInfo);
        } else {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
        }

})