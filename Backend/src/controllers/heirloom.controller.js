const heirloomService = require("../services/heirloom.service");

const createHeirloom = async (req, res) => {
  try {
    const heirloom = await heirloomService.createHeirloom(
      req.user._id,
      req.body,
      req.file
    );

    res.status(201).json({
      success: true,
      message: "Heirloom created successfully",
      data: heirloom
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getFamilyHeirlooms = async (req, res) => {
  try {
    const result = await heirloomService.getFamilyHeirlooms(
      req.user._id,
      req.query
    );

    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const transferHeirloom = async (req, res) => {
  try {
    const { nextOwnerId } = req.body;

    const heirloom = await heirloomService.transferHeirloom(
      req.user._id,
      req.params.id,
      nextOwnerId
    );

    res.status(200).json({
      success: true,
      message: "Heirloom transferred successfully",
      data: heirloom
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const scheduleTransfer = async (req, res) => {
  try {
    const { nextOwnerId, transferDate } = req.body;

    const heirloom = await heirloomService.scheduleTransfer(
      req.user._id,
      req.params.id,
      nextOwnerId,
      transferDate
    );

    res.status(200).json({
      success: true,
      message: "Transfer scheduled successfully",
      data: heirloom
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const verifyHeirloom = async (req, res) => {
  try {
    const result = await heirloomService.verifyHeirloom(
      req.user._id,
      req.params.id
    );

    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateHeirloom = async (req, res) => {
  try {
    const updated = await heirloomService.updateHeirloom(
      req.user._id,
      req.params.id,
      req.body,
      req.file // 👈 important
    );

    res.status(200).json({
      success: true,
      message: "Heirloom updated successfully",
      data: updated
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


const deleteHeirloom = async (req, res) => {
  try {
    const result = await heirloomService.deleteHeirloom(
      req.user._id,
      req.params.id
    );

    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  createHeirloom,
  getFamilyHeirlooms,
  transferHeirloom,
  scheduleTransfer,
  verifyHeirloom,
  updateHeirloom,
  deleteHeirloom
};
