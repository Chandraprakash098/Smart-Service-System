const User = require("../models/User");
const { sendEmail } = require("./emailService");

exports.sendNotification = async (userId, title, message) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Here you would typically integrate with a push notification service
    // For simplicity, we're just sending an email
    await sendEmail(
      user.email,
      title,
      message,
      `<h1>${title}</h1><p>${message}</p>`
    );

    console.log("Notification sent successfully");
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};
