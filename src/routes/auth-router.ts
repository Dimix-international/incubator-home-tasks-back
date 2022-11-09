import {Response, Router} from "express";
import {RequestWithBody} from "../types/types";
import {UserLoginModel} from "../models/auth/UserLoginModel";
import {authService} from "../domains/auth-service";
import {HTTP_STATUSES} from "../data/data";
import {UsersQueryRepository} from "../repositories/users/users-query-repository";


export const authRouter = Router({});

authRouter.post('/login',
    async (req: RequestWithBody<UserLoginModel>, res: Response) => {
        const {login, password} = req.body;

        const user = await UsersQueryRepository.getUserByLogin(login);

        if (!user) {
          res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
          return;
        }
        console.log('user.password', user.password);
        console.log('password', password);
        const isCorrectPassword = await authService.checkCredentials(password, user.password);
        res.sendStatus(isCorrectPassword ? HTTP_STATUSES.NO_CONTENT_204 : HTTP_STATUSES.UNAUTHORIZED_401);
})