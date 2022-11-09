import {Response, Router} from "express";
import {RequestWithBody} from "../types/types";
import {UserLoginModel} from "../models/auth/UserLoginModel";
import {inputValidatorMiddlewares} from "../middlewares/input-validator-middlewares";
import {UserLoginValidatorSchema} from "../validator-schemas/user-login-validator-schema";
import {authService} from "../domains/auth-service";
import {HTTP_STATUSES} from "../data/data";


export const authRouter = Router({});

authRouter.post('/login',
    UserLoginValidatorSchema,
    inputValidatorMiddlewares,
    async (req: RequestWithBody<UserLoginModel>, res: Response) => {
        const {login, password} = req.body;

        const user = await authService.checkCredentials(login, password);
        res.sendStatus(user ? HTTP_STATUSES.NO_CONTENT_204 : HTTP_STATUSES.UNAUTHORIZED_401);
})