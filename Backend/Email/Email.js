import nodemailer from 'nodemailer';

const url = 'http://localhost:3000';

export async function sendEmail(email) {
    const transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "96b93fcd9099ba",
          pass: "2a2059664724c3"
        }
    });

    const mailOptions = {
        from: 'sonanidhyey15@gamil.com',
        to: email,
        subject: 'Sending Email using Node.js',
        html: `
        <p>Please click the link below to reset your password:</p>
        <a href="${url}/Forgot_reset_password?email=${encodeURIComponent(email)}">Reset Password</a>
    `
    };

    
    try {
        let info = await transporter.sendMail(mailOptions);
        return { success: 'Email sent to reset the password please check your mail box !!!', info };
    } catch (error) {
        return { error };
    }

}