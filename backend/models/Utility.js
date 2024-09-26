const mongoose = require("mongoose");

const utilitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["electricity", "water", "gas"],
    required: true,
  },
  reading: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending",
  },
});

const Utility = mongoose.model("Utility", utilitySchema);

module.exports = Utility;
