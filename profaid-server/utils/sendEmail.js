const nodemailer = require("nodemailer");

let transporterPromise = null;

async function initTransporter() {
  if (process.env.EMAIL_PROVIDER === "ethereal") {
    // Ethereal test account (fake SMTP inbox)
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
  }

  // Real SMTP (Gmail / SendGrid / etc.)
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

async function getTransporter() {
  if (!transporterPromise) transporterPromise = initTransporter();
  return transporterPromise;
}

async function sendEmail({ to, subject, text }) {
  const transporter = await getTransporter();
  const from = process.env.EMAIL_FROM || process.env.EMAIL_USER || "no-reply@profaid.com";

  const info = await transporter.sendMail({ from, to, subject, text });

  if (process.env.EMAIL_PROVIDER === "ethereal") {
    console.log("Ethereal Preview URL:", nodemailer.getTestMessageUrl(info));
  }
  return info;
}

module.exports = sendEmail;
