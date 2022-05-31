const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
    const transporter = nodeMailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    let mailOptions = {
        from: process.env.SMTP_MAIL,
        to: options.email,
        subject: options.subject,
        text: options.message,
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) return error;
    })
}
module.exports = sendEmail;