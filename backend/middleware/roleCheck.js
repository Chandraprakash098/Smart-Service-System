const User = require("../models/User");

module.exports = (roles) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (roles.includes(user.role)) {
        next();
      } else {
        res.status(403).json({ message: "Access denied" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error checking user role", error: error.message });
    }
  };
};
