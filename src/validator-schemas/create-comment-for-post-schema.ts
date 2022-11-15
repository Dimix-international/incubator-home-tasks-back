import {body} from "express-validator";

export const CreateCommentForPostSchema = [
    body('content')
        .isString()
        .withMessage('Incorrect data format!')
        .trim()
        .exists({checkFalsy: true})
        .withMessage('This field is required!')
        .isLength({max: 300})
        .withMessage('Max 300 symbols')
        .isLength({min: 20})
        .withMessage('Min 20 symbols'),
]