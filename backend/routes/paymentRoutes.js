const express = require("express");
const {
  createPayment,
  getUserPayments,
  getPaymentById,
  updatePaymentStatus,
  getClientSecret,
} = require("../controllers/paymentController");
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");

const router = express.Router();

router.post("/", auth, createPayment);
router.get("/", auth, getUserPayments);
router.get("/:id", auth, getPaymentById);
router.patch("/:id", auth, roleCheck(["admin"]), updatePaymentStatus);
router.post("/create-payment-intent", auth, getClientSecret);

module.exports = router;
