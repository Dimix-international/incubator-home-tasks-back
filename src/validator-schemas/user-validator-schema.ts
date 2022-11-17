import {body} from "express-validator";

export const UserValidatorSchema = [
    body('login')
        .isString()
        .withMessage('Incorrect data format!')
        .trim()
        .exists({checkFalsy: true})
        .withMessage('This field is required!')
        .isLength({max: 10})
        .withMessage('Max 10 symbols')
        .isLength({min: 3})
        .withMessage('Min 3 symbols'),
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
]