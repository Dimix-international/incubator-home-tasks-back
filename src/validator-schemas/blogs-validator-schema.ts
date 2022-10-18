import {body} from "express-validator";
import {urlFormat} from "../constants/general/general";

export const BlogsValidatorSchema = [
    body('name')
        .isString()
        .withMessage('Incorrect data format!')
        .trim()
        .exists({checkFalsy: true})
        .withMessage('This field is required!')
        .isLength({max: 15})
        .withMessage('Max 15 symbols'),
    body('youtubeUrl')
        .isString()
        .withMessage('Incorrect data format!')
        .trim()
        .exists({checkFalsy: true})
        .withMessage('This field is required!')
        .isLength({max: 100})
        .withMessage('Max 100 symbols')
        .matches(urlFormat)
        .withMessage('Incorrect url address!'),
]
