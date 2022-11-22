import {EmailAdapter} from "../../adapters/email-adapter";


export class EmailsService {

    constructor(protected emailAdapter: EmailAdapter) {}

    async sendEmailConfirmationRegistration (email: string, activationCode: string) {
        const message = `
            <h1>Thank for your registration</h1>
            <p>To finish registration please follow the link below:
                <a href='https://somesite.com/confirm-email?code=${activationCode}'>complete registration</a>
            </p>
        `;
        await this.emailAdapter.sendEmail(email, message, 'Registration');
    }
}