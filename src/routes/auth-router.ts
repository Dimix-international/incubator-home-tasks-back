import {Router} from "express";
import {inputValidatorMiddlewares} from "../middlewares/input-validator-middlewares";
import {ActivateAuthValidatorSchema} from "../validator-schemas/activate-auth-validator-schema";
import {ResendingActivationValidatorSchema} from "../validator-schemas/resending-activation-validator-schema";
import {RegistrationValidatorSchema} from "../validator-schemas/registration-validator-schema";
import {container} from "../composition-root";
import {AuthRouterController} from "./controllers/auth-router-controller";

const authRouterController = container.resolve(AuthRouterController);

export const authRouter = Router({});

authRouter.post('/login', authRouterController.login.bind(authRouterController));
authRouter.post(
    '/registration',
    RegistrationValidatorSchema,
    inputValidatorMiddlewares,
    authRouterController.registration.bind(authRouterController)
);
authRouter.post(
    '/registration-confirmation',
    ActivateAuthValidatorSchema,
    inputValidatorMiddlewares,
    authRouterController.activation.bind(authRouterController)
);
authRouter.post(
    '/registration-email-resending',
    ResendingActivationValidatorSchema,
    inputValidatorMiddlewares,
    authRouterController.resendingEmailRegistration.bind(authRouterController)
);