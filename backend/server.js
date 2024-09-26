const fs = require("fs");
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const authRoutes = require("./routes/authRoutes");
const utilityRoutes = require("./routes/utilityRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const reportRoutes = require("./routes/reportRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

dotenv.config();

const app = express();

console.log(
  "Stripe Secret Key:",
  process.env.STRIPE_SECRET_KEY ? "Set" : "Not Set"
);
console.log("Environment variables:");
console.log("PORT:", process.env.PORT);
console.log("MONGODB_URI:", process.env.MONGODB_URI);
console.log("EMAIL_HOST:", process.env.EMAIL_HOST);
console.log("EMAIL_PORT:", process.env.EMAIL_PORT);
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_FROM:", process.env.EMAIL_FROM);


// Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // or whatever your frontend URL is
    credentials: true,
  })
);
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");

    // Routes
    app.use("/api/auth", authRoutes);
    app.use("/api/utility", utilityRoutes);
    app.use("/api/service", serviceRoutes);
    app.use("/api/payment", paymentRoutes);
    app.use("/api/report", reportRoutes);
    app.use("/api/dashboard", dashboardRoutes);

    // Serve static files from the React app
    app.use(express.static(path.join(__dirname, "../frontend/build")));

    // Catch-all handler to serve the React app
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));

module.exports = app;
