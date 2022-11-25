import {Router} from "express";
import {BlogsValidatorSchema} from "../validator-schemas/blogs-validator-schema";
import {inputValidatorMiddlewares} from "../middlewares/input-validator-middlewares";
import {authMiddleware} from "../middlewares/auth-middleware";
import {CreatePostForBlogValidatorSchema} from "../validator-schemas/create-post-for-blog-validator-schema";
import {container} from "../composition-root";
import {BlogsController} from "./controllers/blogs-controller";


const blogsController = container.resolve(BlogsController);

export const blogsRouter = Router({});

blogsRouter.get('/', blogsController.getBlogs.bind(blogsController));

blogsRouter.get('/:id', blogsController.getBlog.bind(blogsController));

blogsRouter.post('/',
    authMiddleware,
    BlogsValidatorSchema,
    inputValidatorMiddlewares,
    blogsController.createBlog.bind(blogsController)
);

blogsRouter.delete('/:id', authMiddleware, blogsController.deleteBlog.bind(blogsController));

blogsRouter.put('/:id',
    authMiddleware,
    BlogsValidatorSchema,
    inputValidatorMiddlewares,
    blogsController.updateBlog.bind(blogsController)
);


blogsRouter.post('/:blogId/posts',
    authMiddleware,
    CreatePostForBlogValidatorSchema,
    inputValidatorMiddlewares,
    blogsController.createPostForBlog.bind(blogsController)
);

blogsRouter.get('/:blogId/posts', blogsController.getPostOfBlog.bind(blogsController));

