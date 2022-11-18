import {NextFunction, Request, Response} from "express";
import {HTTP_STATUSES} from "../data/data";
import {JwtService} from "../domains/jwt/jwt-service";
import {UsersQueryRepository} from "../repositories/users/users-query-repository";


export const authUserMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    const usersQueryRepository = new UsersQueryRepository();
    const jwtService = new JwtService();

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

        req.user = await usersQueryRepository.getUserById(userId);

        next();

    } catch (e) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
    }
}