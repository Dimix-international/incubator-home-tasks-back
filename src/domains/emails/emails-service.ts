import {EmailAdapter} from "../../adapters/email-adapter";
import {inject, injectable} from "inversify";

@injectable()
export class EmailsService {

    constructor(@inject(EmailAdapter) protected emailAdapter: EmailAdapter) {}

    async sendEmailConfirmationRegistration (email: string, activationCode: string) {
        const message = `
            <h1>Thank for your registration</h1>
            <p>To finish registration please follow the link below:
                <a href='${process.env.API_URL || 'http://localhost:5000/'}auth/registration-confirmation?code=${activationCode}'>complete registration</a>
            </p>
        `;
        await this.emailAdapter.sendEmail(email, message, 'Registration');
    }
}