const mongoose = require("mongoose");

const ownershipHistorySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    receivedAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const heirloomSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    description: String,

    s3Key: {
      type: String,
      required: true
    },

    fileHash: {
      type: String,
      required: true
    },

    blockchainTxHash: String,

    isVerified: {
      type: Boolean,
      default: false
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    family: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Family",
      required: true
    },

    currentOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    nextOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    inheritanceType: {
      type: String,
      enum: ["manual", "time-based"],
      default: "manual"
    },

    transferDate: {
      type: Date
    },

    ownershipHistory: [ownershipHistorySchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Heirloom", heirloomSchema);
