const express = require("express");
const router = express.Router();
const multer = require("multer");

const memoryController = require("../controllers/memory.controller");
const { protect } = require("../middlewares/auth.middleware");

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

/* Upload new memory (multiple images) */
router.post(
  "/upload",
  protect,
  upload.array("images", 10),
  memoryController.uploadMemory
);

/* Get memories */
router.get(
  "/",
  protect,
  memoryController.getFamilyMemories
);

/* Update memory (add new images + update text) */
router.put(
  "/:id",
  protect,
  upload.array("images", 10),
  memoryController.updateMemory
);

/* Delete single image inside memory */
router.delete(
  "/:id/image/:index",
  protect,
  memoryController.deleteMemoryImage
);

/* Delete full memory */
router.delete(
  "/:id",
  protect,
  memoryController.deleteMemory
);

router.get(
  "/:id/image/:index/download",
  protect,
  memoryController.downloadMemoryImage
);

router.get(
  "/:id/download-all",
  protect,
  memoryController.downloadAllImages
);


module.exports = router;
