// const mongoose = require("mongoose");

// const serviceSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     serviceProvider: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },
//     type: {
//       type: String,
//       enum: ["plumbing", "electrical", "cleaning", "maintenance"],
//       required: true,
//     },
//     description: {
//       type: String,
//       required: true,
//     },
//     status: {
//       type: String,
//       enum: ["pending", "assigned", "in_progress", "completed", "cancelled"],
//       default: "pending",
//     },
//     scheduledDate: Date,
//     completedDate: Date,
//     rating: {
//       type: Number,
//       min: 1,
//       max: 5,
//     },
//     review: String,
//   },
//   { timestamps: true }
// );

// const Service = mongoose.model("Service", serviceSchema);

// module.exports = Service;




const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    serviceProvider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      enum: ["plumbing", "electrical", "cleaning", "maintenance"],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "assigned",
        "in_progress",
        "completed",
        "cancelled",
        "confirmed",
      ],
      default: "pending",
    },
    scheduledDate: Date,
    startedDate: Date,
    completedDate: Date,
    confirmedDate: Date,
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    review: String,
  },
  { timestamps: true }
);

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;


