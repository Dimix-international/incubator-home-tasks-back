import {Router} from "express";
import {authMiddleware} from "../middlewares/auth-middleware";
import {inputValidatorMiddlewares} from "../middlewares/input-validator-middlewares";
import {UserValidatorSchema} from "../validator-schemas/user-validator-schema";
import {usersController} from "../composition-root";


export const usersRouter = Router({});

usersRouter.get(
    '/',
    authMiddleware,
    usersController.getUsers.bind(usersController)
);

usersRouter.post('/',
    authMiddleware,
    UserValidatorSchema,
    inputValidatorMiddlewares,
    usersController.createUser.bind(usersController)
)

usersRouter.delete('/:id',
    authMiddleware,
    usersController.deleteUser.bind(usersController)
)