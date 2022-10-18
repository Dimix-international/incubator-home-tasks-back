import {body} from "express-validator";
import {BlogsRepository} from "../repositories/blogs-repository";

export const PostValidatorSchema = [
    body('title')
        .exists({checkFalsy: true})
        .withMessage('This field is required!')
        .isString()
        .withMessage('Incorrect data format!')
        .trim()
        .isLength({max: 30,  min: 1})
        .withMessage('Max 30 symbols'),
    body('shortDescription')
        .exists({checkFalsy: true})
        .withMessage('This field is required!')
        .isString()
        .withMessage('Incorrect data format!')
        .trim()
        .isLength({max: 100,  min: 1})
        .withMessage('Max 100 symbols'),
    body('content')
        .exists({checkFalsy: true})
        .withMessage('This field is required!')
        .isString()
        .withMessage('Incorrect data format!')
        .trim()
        .isLength({max: 1000,  min: 1})
        .withMessage('Max 1000 symbols'),
    body('blogId')
        .exists({checkFalsy: true})
        .withMessage('This field is required!')
        .isString()
        .withMessage('Incorrect data format!')
        .custom((value) => {
            const searchedBlog = BlogsRepository.getBlogById(value);
            if (!searchedBlog) {
                throw new Error('Blog does not exist!');
            }
            return true;
        })
]