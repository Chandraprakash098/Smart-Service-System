
const Service = require("../models/Service");
const User = require("../models/User");
const { sendNotification } = require("../services/notificationService");

exports.createService = async (req, res) => {
  try {
    const { type, description, scheduledDate } = req.body;
    const newService = new Service({
      user: req.user.userId,
      type,
      description,
      scheduledDate,
    });
    await newService.save();

    // Notify admin about new service request
    const admins = await User.find({ role: "admin" });
    admins.forEach((admin) => {
      sendNotification(
        admin._id,
        "New Service Request",
        `A new ${type} service has been requested.`
      );
    });

    res.status(201).json(newService);
  } catch (error) {
    res.status(500).json({
      message: "Error creating service request",
      error: error.message,
    });
  }
};

exports.getUserServices = async (req, res) => {
  try {
    const services = await Service.find({ user: req.user.userId }).sort({
      createdAt: -1,
    });
    res.json(services);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching services", error: error.message });
  }
};

exports.getServiceById = async (req, res) => {
  try {
    console.log("Fetching service with ID:", req.params.id);
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.json(service);
  } catch (error) {
    console.error("Error fetching service:", error);
    res
      .status(500)
      .json({ message: "Error fetching service", error: error.message });
  }
};

exports.updateServiceStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    service.status = status;

    if (status === "completed") {
      service.completedDate = new Date();
      // Notify resident that service is completed and needs confirmation
      sendNotification(
        service.user,
        "Service Completed",
        `Your ${service.type} service has been marked as completed. Please confirm and leave a review.`
      );
    }

    await service.save();

    // Notify relevant parties about the status change
    if (service.serviceProvider) {
      sendNotification(
        service.serviceProvider,
        "Service Status Update",
        `The ${service.type} service status has been updated to ${status}.`
      );
    }
    sendNotification(
      service.user,
      "Service Status Update",
      `Your ${service.type} service status has been updated to ${status}.`
    );

    res.json(service);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating service status", error: error.message });
  }
};

exports.assignService = async (req, res) => {
  try {
    const { serviceProviderId } = req.body;
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    service.serviceProvider = serviceProviderId;
    service.status = "assigned";
    service.startedDate = new Date();

    await service.save();

    // Notify service provider about the new assignment
    sendNotification(
      serviceProviderId,
      "New Service Assignment",
      `You have been assigned a new ${service.type} service.`
    );

    res.json(service);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error assigning service", error: error.message });
  }
};

exports.addServiceReview = async (req, res) => {
  try {
    const { rating, review } = req.body;
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { rating, review, status: "confirmed" },
      { new: true }
    );
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Notify service provider about the review
    if (service.serviceProvider) {
      sendNotification(
        service.serviceProvider,
        "New Service Review",
        `You've received a new review for the ${service.type} service.`
      );
    }

    res.json(service);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding service review", error: error.message });
  }
};



