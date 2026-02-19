const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      minlength: 6
    },

    // 🔥 REQUIRED FOR BLOCKCHAIN
    walletAddress: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^0x[a-fA-F0-9]{40}$/.test(v);
        },
        message: "Invalid wallet address format"
      }
    },

    dateOfBirth: {
      type: Date,
      required: true
    },

    family: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Family",
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
