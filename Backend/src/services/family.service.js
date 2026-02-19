const Family = require("../models/Family");
const User = require("../models/User");
const { generateFamilyId } = require("../utils/hashGenerator");

const createFamily = async (userId, data) => {
  const { name } = data;

  const familyId = generateFamilyId();

  const family = await Family.create({
    name,
    familyId,
    createdBy: userId,
    members: [userId]
  });

  await User.findByIdAndUpdate(userId, {
    family: family._id
  });

  return family;
};

const joinFamily = async (userId, familyId) => {
  const family = await Family.findOne({ familyId });

  if (!family) {
    throw new Error("Family not found");
  }

  if (family.members.includes(userId)) {
    throw new Error("Already a member");
  }

  family.members.push(userId);
  await family.save();

  await User.findByIdAndUpdate(userId, {
    family: family._id
  });

  return family;
};

const getFamilyMembers = async (userId) => {
  const user = await User.findById(userId).populate({
    path: "family",
    populate: {
      path: "members",
      select: "name email"
    }
  });

  return user.family;
};

module.exports = {
  createFamily,
  joinFamily,
  getFamilyMembers
};
