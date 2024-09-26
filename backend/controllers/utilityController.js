const Utility = require("../models/Utility");

exports.addUtilityReading = async (req, res) => {
  try {
    const { type, reading, amount } = req.body;
    const newUtility = new Utility({
      user: req.user.userId,
      type,
      reading,
      amount,
    });
    await newUtility.save();
    res.status(201).json(newUtility);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding utility reading", error: error.message });
  }
};

exports.getUserUtilities = async (req, res) => {
  try {
    const utilities = await Utility.find({ user: req.user.userId }).sort({
      date: -1,
    });
    res.json(utilities);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching utilities", error: error.message });
  }
};

exports.getUtilityById = async (req, res) => {
  try {
    const utility = await Utility.findById(req.params.id);
    if (!utility) {
      return res.status(404).json({ message: "Utility not found" });
    }
    res.json(utility);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching utility", error: error.message });
  }
};

exports.updateUtilityStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const utility = await Utility.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!utility) {
      return res.status(404).json({ message: "Utility not found" });
    }
    res.json(utility);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating utility status", error: error.message });
  }
};
