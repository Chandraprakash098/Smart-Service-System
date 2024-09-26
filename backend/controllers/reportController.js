const Utility = require("../models/Utility");
const Service = require("../models/Service");
const Payment = require("../models/Payment");

exports.getUtilityReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const utilityReport = await Utility.aggregate([
      {
        $match: {
          date: { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      },
      {
        $group: {
          _id: "$type",
          totalUsage: { $sum: "$reading" },
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);
    res.json(utilityReport);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error generating utility report",
        error: error.message,
      });
  }
};

exports.getServiceReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const serviceReport = await Service.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      },
      {
        $group: {
          _id: "$type",
          totalServices: { $sum: 1 },
          completedServices: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
          averageRating: { $avg: "$rating" },
        },
      },
    ]);
    res.json(serviceReport);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error generating service report",
        error: error.message,
      });
  }
};

exports.getPaymentReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const paymentReport = await Payment.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      },
      {
        $group: {
          _id: "$type",
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);
    res.json(paymentReport);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error generating payment report",
        error: error.message,
      });
  }
};
