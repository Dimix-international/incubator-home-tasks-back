import nodemailer from "nodemailer";


export class EmailAdapter {
    async sendEmail (email: string, message: string, subject: string) {
        // create reusable transporter object using the default SMTP transport
        let transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: 'frontdeveloperdima@gmail.com', // generated ethereal user
                pass: 'ahfbbawovcvurenr', // generated ethereal password
            },
        });

        // send mail with defined transport object
        let info = await transport.sendMail({
            from: 'Dima <frontdeveloperdima@gmail.com>', // sender address
            to: email, // list of receivers
            subject: subject, // Subject line
            html: message, // html body
        });
    }
}
