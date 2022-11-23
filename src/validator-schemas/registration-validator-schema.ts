import {body} from "express-validator";
import {RequestWithBody} from "../types/types";
import {UserLoginModel} from "../models/auth/UserLoginModel";
import {UsersQueryRepository} from "../repositories/users/users-query-repository";
import {RegistrationViewModel} from "../models/auth/RegistrationViewModel";

const usersQueryRepository = new UsersQueryRepository();

export const RegistrationValidatorSchema = [
    body('login')
        .isString()
        .withMessage('Incorrect data format!')
        .trim()
        .exists({checkFalsy: true})
        .withMessage('This field is required!')
        .isLength({max: 10})
        .withMessage('Max 10 symbols')
        .isLength({min: 3})
        .withMessage('Min 3 symbols')
        .custom( async (_, {req}) => {
            const {body: { login }} = req as RequestWithBody<RegistrationViewModel>;
            const user = await usersQueryRepository.getUserByEmailLogin(login);
            if (user) {
                throw new Error('Login is exist!');
            }
            return true;
        }),
    body('password')
        .isString()
        .withMessage('Incorrect data format!')
        .trim()
        .exists({checkFalsy: true})
        .withMessage('This field is required!')
        .isLength({max: 20})
        .withMessage('Max 20 symbols')
        .isLength({min: 6})
        .withMessage('Min 6 symbols'),
    body('email')
        .isString()
        .withMessage('Incorrect data format!')
        .trim()
        .exists({checkFalsy: true})
        .withMessage('This field is required!')
        .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
        .withMessage('Incorrect email format!')
        .custom( async (_, {req}) => {
            const {body: { email }} = req as RequestWithBody<RegistrationViewModel>;
            const user = await usersQueryRepository.getUserByEmailLogin(email);
            if (user) {
                throw new Error('Email is exist!');
            }
            return true;
        }),
]