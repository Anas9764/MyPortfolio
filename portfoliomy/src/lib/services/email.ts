import nodemailer from "nodemailer";

function getTransporter() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return null;
  }
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

export async function sendNotificationEmail(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const transporter = getTransporter();
  if (!transporter) return;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: "anasqureshi.dev@gmail.com",
    subject: `New Portfolio Message from ${data.name}`,
    text: `You have received a new message from your portfolio website.\n\nFrom: ${data.name} (${data.email})\nSubject: ${data.subject}\n\nMessage:\n${data.message}`,
  };

  transporter.sendMail(mailOptions).catch((err) => {
    console.error("Failed to send notification email:", err);
  });
}

export async function sendReplyEmail(data: {
  to: string;
  subject: string;
  body: string;
  replyTo?: string;
}) {
  const transporter = getTransporter();
  if (!transporter) {
    throw new Error(
      "Email credentials not configured on the server. Please add EMAIL_USER and EMAIL_PASS to .env.local"
    );
  }

  await transporter.sendMail({
    from: data.replyTo || process.env.EMAIL_USER,
    to: data.to,
    subject: data.subject,
    text: data.body,
  });
}
