import {NextFunction, Request, Response} from "express";
import {HTTP_STATUSES} from "../data/data";
import {decodedBase64} from "../helpers/helpers";
import {PASSWORD_ADMIN, Roles} from "../constants/general/general";


export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    if (!req.headers.authorization) {
        res.sendStatus(401);
        return;
    }

    if (req.headers.authorization.split(" ")[0] !== "Basic") {
        res.sendStatus(401);
        return;
    }

    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = decodedBase64(token);

    if (decodedToken !== `${Roles.ADMIN}:${PASSWORD_ADMIN}`) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
        return;
    }

    next();
}