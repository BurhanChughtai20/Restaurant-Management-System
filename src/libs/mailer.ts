// libs/mailer.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true", // convert string to boolean
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false, // optional, helps with self-signed certs
  },
});

export async function sendOtpEmail(to: string, otp: string) {
  const info = await transporter.sendMail({
    from: `"No Reply" <${process.env.SMTP_USER}>`,
    to,
    subject: "Your OTP Code",
    html: `<h3>Your OTP Code is: <strong>${otp}</strong></h3>
           <p>This code is valid for 10 minutes.</p>`,
  });
  console.log("OTP email sent: %s", info.messageId);
}
