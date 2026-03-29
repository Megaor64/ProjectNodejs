import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail", // אפשר גם SMTP אחר
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

async function sendVerificationEmail(to: string, code: string): Promise<void> {
    await transporter.sendMail({
        from: `"Spacode" <${process.env.EMAIL_USER}>`,
        to: to,
        subject: "Your Verification Code",
        text: `Your verification code is: ${code}`,
        html: `<h2>Your verification code is:</h2>
           <h1>${code}</h1>`,
    });
}

export { sendVerificationEmail }