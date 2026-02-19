const express = require("express");
const router = express.Router();

const familyController = require("../controllers/family.controller");
const { protect } = require("../middlewares/auth.middleware");

router.post("/create", protect, familyController.createFamily);
router.post("/join", protect, familyController.joinFamily);
router.get("/members", protect, familyController.getFamilyMembers);

module.exports = router;
