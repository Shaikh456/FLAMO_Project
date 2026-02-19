const mongoose = require("mongoose");

const memorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },

    // 🔥 MULTIPLE IMAGES
    images: [
      {
        s3Key: String,
        fileHash: String,
      }
    ],

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    family: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Family",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Memory", memorySchema);
