import {UsersQueryRepository} from "../repositories/users/users-query-repository";
import {body} from "express-validator";
import {RequestWithBody} from "../types/types";
import {ResendingViewModel} from "../models/auth/ResendingViewModel";

const usersQueryRepository = new UsersQueryRepository();

export const ResendingActivationValidatorSchema = [

    body('email')
        .isString()
        .withMessage('Incorrect data format!')
        .trim()
        .exists({checkFalsy: true})
        .withMessage('This field is required!')
        .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
        .withMessage('Incorrect email format!')
        .custom( async (_, {req}) => {
            const {body: { email }} = req as RequestWithBody<ResendingViewModel>;

            const user = await usersQueryRepository.getUserByEmailLogin(email);

            if (!user) {
                throw new Error('User does not exist!');
            }

            if (user.isActivated) {
                throw new Error('Email was already confirmed!');
            }

            if (user.countSendEmailsActivated > 10) {
                throw new Error('Check correctness your email address!');
            }

            return true;
        })
]