const express = require("express");
const {
  getUtilityReport,
  getServiceReport,
  getPaymentReport,
} = require("../controllers/reportController");
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");

const router = express.Router();

router.get("/utility", auth, roleCheck(["admin"]), getUtilityReport);
router.get("/service", auth, roleCheck(["admin"]), getServiceReport);
router.get("/payment", auth, roleCheck(["admin"]), getPaymentReport);

module.exports = router;
