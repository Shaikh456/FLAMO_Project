const express = require("express");
const router = express.Router();
const multer = require("multer");

const heirloomController = require("../controllers/heirloom.controller");
const { protect } = require("../middlewares/auth.middleware");

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.post("/create", protect, upload.single("image"), heirloomController.createHeirloom);

router.get("/", protect, heirloomController.getFamilyHeirlooms);

router.post("/:id/transfer", protect, heirloomController.transferHeirloom);

router.post("/:id/schedule-transfer", protect, heirloomController.scheduleTransfer);

router.post("/:id/verify", protect, heirloomController.verifyHeirloom);


router.put(
  "/:id",
  protect,
  upload.single("image"), // 👈 important
  heirloomController.updateHeirloom
);

router.delete("/:id", protect, heirloomController.deleteHeirloom);

module.exports = router;
