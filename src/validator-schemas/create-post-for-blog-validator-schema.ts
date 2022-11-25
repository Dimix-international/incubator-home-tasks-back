import {body} from "express-validator";

export const CreatePostForBlogValidatorSchema = [
    body('title')
        .isString()
        .withMessage('Incorrect data format!')
        .trim()
        .exists({checkFalsy: true})
        .withMessage('This field is required!')
        .isLength({max: 30})
        .withMessage('Max 30 symbols'),
    body('shortDescription')
        .isString()
        .withMessage('Incorrect data format!')
        .trim()
        .exists({checkFalsy: true})
        .withMessage('This field is required!')
        .isLength({max: 100})
        .withMessage('Max 100 symbols'),
    body('content')
        .isString()
        .withMessage('Incorrect data format!')
        .trim()
        .exists({checkFalsy: true})
        .withMessage('This field is required!')
        .isLength({max: 1000})
        .withMessage('Max 1000 symbols'),
]
