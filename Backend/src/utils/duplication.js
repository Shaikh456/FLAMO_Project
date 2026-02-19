const Memory = require("../models/Memory");

const checkDuplicate = async (fileHash) => {
  return await Memory.findOne({ fileHash });
};

module.exports = { checkDuplicate };
