const nodemailer = require("nodemailer");
require("dotenv").config(); 

console.log("Email configuration:");
console.log("HOST:", process.env.EMAIL_HOST || "Not set");
console.log("PORT:", process.env.EMAIL_PORT || "Not set");
console.log("USER:", process.env.EMAIL_USER || "Not set");
console.log("FROM:", process.env.EMAIL_FROM || "Not set");

if (
  !process.env.EMAIL_HOST ||
  !process.env.EMAIL_PORT ||
  !process.env.EMAIL_USER ||
  !process.env.EMAIL_PASS
) {
  console.error(
    "Email configuration is incomplete. Please check your .env file."
  );
}

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // Use TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  debug: true, // Enable debugging
  logger: true, // Log information
});

exports.sendEmail = async (to, subject, text, html) => {
  if (!process.env.EMAIL_FROM) {
    throw new Error("EMAIL_FROM is not set in the environment variables");
  }

  try {
    console.log(
      "Attempting to send email with configuration:",
      JSON.stringify(transporter.options, null, 2)
    );
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text,
      html,
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
