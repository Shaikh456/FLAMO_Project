const memoryService = require("../services/memory.service");

/* Upload Memory */
const uploadMemory = async (req, res) => {
  try {
    const memory = await memoryService.uploadMemory(
      req.user._id,
      req.body,
      req.files
    );

    res.status(201).json({
      success: true,
      message: "Memory uploaded successfully",
      data: memory
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/* Get Memories */
const getFamilyMemories = async (req, res) => {
  try {
    const result = await memoryService.getFamilyMemories(
      req.user._id,
      req.query
    );

    res.status(200).json({
      success: true,
      ...result
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/* Update Memory */
const updateMemory = async (req, res) => {
  try {
    const updatedMemory = await memoryService.updateMemory(
      req.user._id,
      req.params.id,
      req.body,
      req.files
    );

    res.status(200).json({
      success: true,
      message: "Memory updated successfully",
      data: updatedMemory
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/* Delete Single Image */
const deleteMemoryImage = async (req, res) => {
  try {
    const result = await memoryService.deleteMemoryImage(
      req.user._id,
      req.params.id,
      req.params.index
    );

    res.status(200).json({
      success: true,
      message: result.message
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/* =====================================================
   Download Single Image
===================================================== */
const downloadMemoryImage = async (req, res) => {
  try {
    const url = await memoryService.downloadMemoryImage(
      req.user._id,
      req.params.id,
      req.params.index
    );

    res.status(200).json({
      success: true,
      url
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const downloadAllImages = async (req, res) => {
  try {
    await memoryService.downloadAllImages(
      req.user._id,
      req.params.id,
      res
    );
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};




/* Delete Full Memory */
const deleteMemory = async (req, res) => {
  try {
    const result = await memoryService.deleteMemory(
      req.user._id,
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: result.message
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  uploadMemory,
  getFamilyMemories,
  updateMemory,
  deleteMemoryImage,
  deleteMemory,
  downloadMemoryImage,
  downloadAllImages,
};
