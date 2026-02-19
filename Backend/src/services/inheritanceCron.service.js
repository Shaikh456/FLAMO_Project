const cron = require("node-cron");
const Heirloom = require("../models/Heirloom");
const User = require("../models/User");

/**
 * Execute scheduled heirloom transfers
 */
const runInheritanceCron = () => {
  // Runs every minute
  cron.schedule("* * * * *", async () => {
    try {
      console.log("🔄 Checking scheduled heirloom transfers...");

      const now = new Date();

      const heirlooms = await Heirloom.find({
        inheritanceType: "time-based",
        transferDate: { $lte: now },
        nextOwner: { $exists: true, $ne: null }
      });

      for (const heirloom of heirlooms) {
        const currentOwner = await User.findById(heirloom.currentOwner);
        const nextOwner = await User.findById(heirloom.nextOwner);

        if (!currentOwner || !nextOwner) continue;

        // Safety check: family match
        if (
          currentOwner.family.toString() !==
          nextOwner.family.toString()
        ) {
          continue;
        }

        console.log(`🚀 Executing transfer for heirloom: ${heirloom._id}`);

        // Add to history
        heirloom.ownershipHistory.push({
          owner: nextOwner._id,
          receivedAt: new Date()
        });

        // Transfer ownership
        heirloom.currentOwner = nextOwner._id;

        // Reset scheduling
        heirloom.inheritanceType = "manual";
        heirloom.nextOwner = null;
        heirloom.transferDate = null;

        await heirloom.save();

        console.log(`✅ Transfer completed for heirloom: ${heirloom._id}`);
      }
    } catch (error) {
      console.error("❌ Cron Error:", error.message);
    }
  });
};

module.exports = runInheritanceCron;
