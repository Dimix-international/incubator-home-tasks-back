import {UsersQueryRepository} from "../repositories/users/users-query-repository";
import {body} from "express-validator";
import {RequestWithQuery} from "../types/types";
import {ActivationViewModel} from "../models/auth/ActivationViewModel";

const usersQueryRepository = new UsersQueryRepository();

export const ActivateAuthValidatorSchema = [
    body('code')
        .custom( async (_, {req}) => {
            const {query: { code }} = req as RequestWithQuery<ActivationViewModel>;
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