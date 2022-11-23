import {UsersQueryRepository} from "../repositories/users/users-query-repository";
import {body} from "express-validator";
import {RequestWithBody} from "../types/types";
import {ActivationViewModel} from "../models/auth/ActivationViewModel";

const usersQueryRepository = new UsersQueryRepository();

export const ActivateAuthValidatorSchema = [
    body('code')
        .custom( async (_, {req}) => {
            const {body: { code }} = req as RequestWithBody<ActivationViewModel>;
            const user = await usersQueryRepository.getUserByActivatedCode(code);

            if (!user) {
                throw new Error('User does not exist!');
            }

            if (user.isActivated) {
                throw new Error('User was activated!');
            }

            return true;
        })
]