import {UsersQueryRepository} from "../../repositories/users/users-query-repository";
import {AuthService} from "../../domains/auth/auth-service";
import {RequestWithBody, RequestWithQuery} from "../../types/types";
import {UserLoginModel} from "../../models/auth/UserLoginModel";
import {Response} from "express";
import {LoginViewModel} from "../../models/auth/LoginViewModel";
import {HTTP_STATUSES} from "../../data/data";
import {RegistrationViewModel} from "../../models/auth/RegistrationViewModel";
import {UserService} from "../../domains/users/user-service";
import {EmailsService} from "../../domains/emails/emails-service";
import {ActivationViewModel} from "../../models/auth/ActivationViewModel";
import {ResendingViewModel} from "../../models/auth/ResendingViewModel";

export class AuthRouterController {

    constructor(protected usersQueryRepository: UsersQueryRepository,
                protected authService: AuthService,
                protected userService: UserService,
                protected emailsService: EmailsService
    ) {}

    async login(req: RequestWithBody<UserLoginModel>, res: Response<LoginViewModel>) {
        const {loginOrEmail, password} = req.body;

        const user = await this.usersQueryRepository.getUserByEmailLogin(loginOrEmail);

        if (!user) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
            return;
        }
        const {id} = user;
        const userInfo = await this.authService.checkCredentials(password, user.password, {id});

        if (userInfo) {
            res.status(HTTP_STATUSES.OK_200).send(userInfo);
        } else {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
        }

    }

    async registration (req: RequestWithBody<RegistrationViewModel>, res: Response) {
        const {login, password, email} = req.body;

        const isExistsUser = await this.usersQueryRepository.getUserByEmailLogin(email);

        if (isExistsUser) {
            return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
        }

        const createdUser = await this.userService.createUser(login, password, email);

        if (!createdUser) {
            return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
        }

        try {
            await this.emailsService.sendEmailConfirmationRegistration(email, createdUser.activationCode);
            await this.userService.updateCountSendEmails(createdUser.id);
            return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        } catch {
            await this.userService.deleteUserById(createdUser.id);
            return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
        }
    }

    async activation (req: RequestWithQuery<ActivationViewModel>, res: Response) {
       const {code} = req.query;

       const user = await this.usersQueryRepository.getUserByActivatedCode(code);

       if (!user) {
           return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
       }

       const isActivatedUser = await this.userService.activateUser(user.id);

       if (!isActivatedUser) {
           return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
       }
       return res.sendStatus(HTTP_STATUSES.OK_200);

    }

    async resendingEmailRegistration (req: RequestWithBody<ResendingViewModel>, res: Response) {
        const {email} = req.body;

        const user = await this.usersQueryRepository.getUserByEmailLogin(email);

        if (!user) {
            return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }

        try {
            await this.emailsService.sendEmailConfirmationRegistration(email, user.activationCode);
            await this.userService.updateCountSendEmails(user.id);
            return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        } catch {
            return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
        }
    }

}