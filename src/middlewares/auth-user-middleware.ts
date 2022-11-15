import {NextFunction, Request, Response} from "express";
import {HTTP_STATUSES} from "../data/data";
import {decodedBase64} from "../helpers/helpers";
import {PASSWORD_ADMIN, Roles} from "../constants/general/general";
import {jwtService} from "../domains/jwt-service";
import {userService} from "../domains/user-service";
import {UsersQueryRepository} from "../repositories/users/users-query-repository";


export const authUserMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    try {

        if (!req.headers) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
            return;
        }

        const accessToken = req.headers.authorization?.split(' ')[1];
        const formAuth = req.headers.authorization?.split(' ')[0];

        if (!accessToken || formAuth !== 'Bearer') {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
            return;
        }

        const userId = await jwtService.getUserIdByToken(accessToken);

        if (!userId) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
            return;
        }

        req.user = await UsersQueryRepository.getUserById(userId);

        next();

    } catch (e) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
    }
}