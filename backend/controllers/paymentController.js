const Payment = require("../models/Payment");
const Utility = require("../models/Utility");
const Service = require("../models/Service");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

console.log(
  "Stripe Secret Key (last 4 characters):",
  process.env.STRIPE_SECRET_KEY.slice(-4)
);

exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Ensure amount is in cents and rounded
      currency: "usd",
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res
      .status(500)
      .json({ message: "Error creating payment intent", error: error.message });
  }
};



exports.createPayment = async (req, res) => {
  try {
    console.log("Received payment request:", req.body);
    const { amount, paymentMethod, paymentIntentId } = req.body;

    // Validate input
    if (!amount || !paymentMethod || !paymentIntentId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Retrieve the payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({ message: "Payment not successful" });
    }

    

    const newPayment = new Payment({
      user: req.user.userId,
      amount,
      type: "general", // or you could remove this field if it's not needed
      paymentMethod,
      status: "completed",
      transactionId: paymentIntentId,
    });

    await newPayment.save();

    res.status(201).json(newPayment);
  } catch (error) {
    console.error("Error in createPayment:", error);
    res.status(500).json({
      message: "Error creating payment",
      error: error.message,
      stack: error.stack,
    });
  }
};
exports.getUserPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user.userId })
      .sort({ createdAt: -1 })
      .populate("utility service");
    res.json(payments);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching payments", error: error.message });
  }
};

exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate(
      "utility service"
    );
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.json(payment);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching payment", error: error.message });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const { status, transactionId } = req.body;
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status, transactionId },
      { new: true }
    );
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.json(payment);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating payment status", error: error.message });
  }
};

exports.getClientSecret = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    console.log("Creating payment intent for amount:", amount);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Ensure amount is in cents and rounded
      currency: "usd",
    });

    console.log("Payment intent created:", paymentIntent.id);

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res
      .status(500)
      .json({ message: "Error creating payment intent", error: error.message });
  }
};


