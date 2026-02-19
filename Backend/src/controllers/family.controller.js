const familyService = require("../services/family.service");

/**
 * @desc    Create a new family
 * @route   POST /api/family/create
 * @access  Private
 */
const createFamily = async (req, res) => {
  try {
    // Ensure logged-in user exists
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const family = await familyService.createFamily(
      req.user._id,  // ✅ Only pass userId
      req.body
    );

    return res.status(201).json({
      success: true,
      message: "Family created successfully",
      data: family
    });

  } catch (error) {
    console.error("Create Family Error:", error.message);

    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


/**
 * @desc    Join an existing family using familyId
 * @route   POST /api/family/join
 * @access  Private
 */
const joinFamily = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const { familyId } = req.body;

    if (!familyId) {
      return res.status(400).json({
        success: false,
        message: "Family ID is required"
      });
    }

    const family = await familyService.joinFamily(
      req.user._id,
      familyId
    );

    return res.status(200).json({
      success: true,
      message: "Joined family successfully",
      data: family
    });

  } catch (error) {
    console.error("Join Family Error:", error.message);

    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


/**
 * @desc    Get all members of logged-in user's family
 * @route   GET /api/family/members
 * @access  Private
 */
const getFamilyMembers = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const family = await familyService.getFamilyMembers(req.user._id);

    return res.status(200).json({
      success: true,
      data: family
    });

  } catch (error) {
    console.error("Get Family Members Error:", error.message);

    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createFamily,
  joinFamily,
  getFamilyMembers
};
