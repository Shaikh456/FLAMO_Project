const crypto = require("crypto");

/**
 * Generate short family ID
 * Example: A4F8C2D1
 */
const generateFamilyId = () => {
  return crypto.randomBytes(4).toString("hex").toUpperCase();
};

/**
 * Generate SHA256 hash of file buffer
 * Used for image deduplication
 */
const generateFileHash = (buffer) => {
  return crypto
    .createHash("sha256")
    .update(buffer)
    .digest("hex");
};

module.exports = {
  generateFamilyId,
  generateFileHash
};
