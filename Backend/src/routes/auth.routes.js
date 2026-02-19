const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { protect } = require("../middlewares/auth.middleware");

router.get("/me", protect, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

router.post("/register", authController.register);
router.post("/login", authController.login);

module.exports = router;
