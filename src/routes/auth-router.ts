import {Router} from "express";
import {authRouterController} from "../composition-root";


export const authRouter = Router({});

authRouter.post('/login', authRouterController.login.bind(authRouterController));