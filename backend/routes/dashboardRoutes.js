


const express = require("express");
const {
  getDashboard,
  getServiceProviders,
} = require("../controllers/dashboardController");
const auth = require("../middleware/auth");


const router = express.Router();

router.get("/service-providers", auth, getServiceProviders);
router.get("/:role", auth, getDashboard);

module.exports = router;