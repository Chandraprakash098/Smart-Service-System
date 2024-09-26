


const express = require("express");
const {
  createService,
  getUserServices,
  getServiceById,
  updateServiceStatus,
  assignService,
  addServiceReview,
} = require("../controllers/serviceController");
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");

const router = express.Router();

router.post("/", auth, roleCheck(["resident"]), createService);
router.get("/", auth, getUserServices);
router.get("/:id", auth, getServiceById);
router.patch(
  "/:id/status",
  auth,
  roleCheck(["admin", "service_provider"]),
  updateServiceStatus
);
router.patch("/:id/assign", auth, roleCheck(["admin"]), assignService);
router.post("/:id/review", auth, roleCheck(["resident"]), addServiceReview);

module.exports = router;
