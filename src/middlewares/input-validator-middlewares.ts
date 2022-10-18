import {NextFunction, Request, Response} from "express";
import { validationResult } from "express-validator";
import {HTTP_STATUSES} from "../data/data";

export const inputValidatorMiddlewares = (req: Request, res: Response, next: NextFunction) => {

    const myValidationResult = validationResult.withDefaults({
        formatter: error => {
            return {
                message: error.msg,
                field: error.param
            };
        },
    });

    const errors = myValidationResult(req);

    if (!errors.isEmpty()) {
        const errorsMessages = errors.array({onlyFirstError: true});
        return res.status(HTTP_STATUSES.BAD_REQUEST_400).send({
            errorsMessages
        })
    } else {
        next();
    }
}