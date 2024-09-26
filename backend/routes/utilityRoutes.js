const express = require("express");
const {
  addUtilityReading,
  getUserUtilities,
  getUtilityById,
  updateUtilityStatus,
} = require("../controllers/utilityController");
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");

const router = express.Router();

router.post("/", auth, roleCheck(["admin"]), addUtilityReading);
router.get("/", auth, getUserUtilities);
router.get("/:id", auth, getUtilityById);
router.patch("/:id", auth, roleCheck(["admin"]), updateUtilityStatus);

module.exports = router;
