const User = require("../models/User");

const getDashboardData = async (userId) => {

  const user = await User.findById(userId)
    .select("-password")
    .populate({
      path: "family",
      select: "name familyId createdAt"
    });

  if (!user) {
    throw new Error("User not found");
  }

  return {
    user,
    family: user.family || null
  };
};

module.exports = {
  getDashboardData
};
