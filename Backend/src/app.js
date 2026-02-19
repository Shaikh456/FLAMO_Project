const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const runInheritanceCron = require("./services/inheritanceCron.service");


dotenv.config();

const connectDB = require("./config/db");

// Route imports
const authRoutes = require("./routes/auth.routes");
const familyRoutes = require("./routes/family.routes");
const heirloomRoutes = require("./routes/heirloom.routes");
const memoryRoutes = require("./routes/memory.routes");
const dashboardRoutes = require("./routes/dashboard.routes");

const app = express();

// --------------------
// Middleware
// --------------------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --------------------
// Database Connection
// --------------------
connectDB();

// --------------------
// Routes
// --------------------
app.use("/api/auth", authRoutes);
app.use("/api/family", familyRoutes);
app.use("/api/heirlooms", heirloomRoutes);
app.use("/api/memories", memoryRoutes);
app.use("/api/dashboard", dashboardRoutes);

// --------------------
// Health Check Route
// --------------------
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "FLAMO Backend Running 🚀"
  });
});

// --------------------
// Global Error Handler (optional but recommended)
// --------------------
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    success: false,
    message: "Something went wrong"
  });
});

runInheritanceCron();


module.exports = app;
