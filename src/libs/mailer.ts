import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  connectionTimeout: 10_000,
  greetingTimeout: 10_000,
  socketTimeout: 10_000,
  tls: { rejectUnauthorized: false },
});

transporter.verify((err, success) => {
  if (err) {
    console.error("SMTP connection failed:", err);
  } else {
    console.log("SMTP connection successful!");
  }
});

export async function sendOtpEmail(to: string, otp: string) {
  console.log("Sending OTP email...");
  const info = await transporter.sendMail({
    from: `"No Reply" <${process.env.SMTP_USER}>`,
    to,
    subject: "Your OTP Code",
    html: `<h3>Your OTP Code is: <strong>${otp}</strong></h3>`,
  });
  console.log("OTP email sent:", info.messageId);
}
