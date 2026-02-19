const dashboardService = require("../services/dashboard.service");

/**
 * GET DASHBOARD
 */
const getDashboard = async (req, res) => {
  try {
    const data = await dashboardService.getDashboardData(req.user._id);

    res.status(200).json({
      success: true,
      data
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getDashboard
};
