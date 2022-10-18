import {NextFunction, Request, Response} from "express";
import {HTTP_STATUSES} from "../data/data";
import {decodedBase64} from "../helpers/helpers";
import {PASSWORD_ADMIN, Roles} from "../constants/general/general";


export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    if (req.method === 'OPTIONS') {
       next();
    }

    try {

        if (!req.headers) {
            res.send(HTTP_STATUSES.UNAUTHORIZED_401);
            return;
        }

        const token = req.headers.authorization?.split(' ')[1];
        const formAuth = req.headers.authorization?.split(' ')[0];

        if (!token || formAuth !== 'Basic') {
            res.send(HTTP_STATUSES.UNAUTHORIZED_401);
            return;
        }

        const decodedToken = decodedBase64(token);

        if (decodedToken !== `${Roles.ADMIN}:${PASSWORD_ADMIN}`) {
            res.send(HTTP_STATUSES.UNAUTHORIZED_401);
            return;
        }

        next();

    } catch (e) {
        console.log(e);
        res.send(HTTP_STATUSES.UNAUTHORIZED_401);
    }

}