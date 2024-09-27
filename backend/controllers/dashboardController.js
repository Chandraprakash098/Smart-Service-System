const Utility = require("../models/Utility");
const Service = require("../models/Service");
const Payment = require("../models/Payment");
const User = require("../models/User");

exports.getDashboard = async (req, res) => {
  const { role } = req.params;
  const userId = req.user.userId;

  try {
    let dashboardData;

    switch (role) {
      case "admin":
        dashboardData = await getAdminDashboard();
        break;
      case "resident":
        dashboardData = await getResidentDashboard(userId);
        break;
      case "service_provider":
        dashboardData = await getServiceProviderDashboard(userId);
        break;
      default:
        return res.status(400).json({ message: "Invalid role" });
    }

    res.json(dashboardData);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching dashboard data", error: error.message });
  }
};

async function getAdminDashboard() {
  try {
    const recentUtilities = await Utility.find().sort({ date: -1 }).limit(5);
    const pendingServices = await Service.find({ status: "pending" }).limit(5);
    const recentPayments = await Payment.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "email name"); // Populate the user field with email

    return {
      recentUtilities,
      pendingServices,
      recentPayments: recentPayments.map((payment) => ({
        _id: payment._id,
        amount: payment.amount,
        status: payment.status,
        // userEmail: payment.user.email,
        // userName: payment.user.name,
        userEmail: payment.user ? payment.user.email : "N/A",
        userName: payment.user ? payment.user.name : "Unknown User",
      })),
    };
  } catch (error) {
    console.error("Error in getAdminDashboard:", error);
    throw new Error("Failed to fetch admin dashboard data");
  }
}




// ... rest of the code remains the same

async function getResidentDashboard(userId) {
  const utilities = await Utility.find({ user: userId })
    .sort({ date: -1 })
    .limit(5);
  const services = await Service.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(5);
  const payments = await Payment.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(5);

  return { utilities, services, payments };
}

async function getServiceProviderDashboard(userId) {
  const assignedServices = await Service.find({
    serviceProvider: userId,
    status: { $in: ["assigned", "in_progress"] },
  }).sort({ scheduledDate: 1 });
  const completedServices = await Service.find({
    serviceProvider: userId,
    status: "completed",
  })
    .sort({ completedDate: -1 })
    .limit(5);

  return { assignedServices, completedServices };
}

exports.getServiceProviders = async (req, res) => {
  console.log("getServiceProviders function called");
  try {
    const serviceProviders = await User.find({
      role: "service_provider",
    }).select("name _id");
    console.log("Service providers found:", serviceProviders);
    res.json(serviceProviders);
  } catch (error) {
    console.error("Error in getServiceProviders:", error);
    res.status(500).json({
      message: "Error fetching service providers",
      error: error.message,
    });
  }
};
