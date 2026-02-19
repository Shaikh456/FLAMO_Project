const { ethers } = require("ethers");
require("dotenv").config();

const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC_URL);

const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const contractABI = [
  "function registerHeirloom(string memory _fileHash) public",
  "function transferHeirloom(string memory _fileHash, address _newOwner) public",
  "function verifyHeirloom(string memory _fileHash) public view returns (address)"
];

const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  contractABI,
  wallet
);

/**
 * Register Heirloom on Polygon
 */
const registerOnBlockchain = async (fileHash) => {
  const tx = await contract.registerHeirloom(fileHash);
  await tx.wait();

  return {
    txHash: tx.hash,
    verified: true
  };
};

/**
 * Transfer Ownership on Polygon
 */
const transferOnBlockchain = async (fileHash, newOwnerAddress) => {
  const tx = await contract.transferHeirloom(fileHash, newOwnerAddress);
  await tx.wait();

  return {
    txHash: tx.hash
  };
};

/**
 * Verify Heirloom on Polygon
 */
const verifyOnBlockchain = async (fileHash) => {
  const owner = await contract.verifyHeirloom(fileHash);

  return {
    verified: owner !== ethers.ZeroAddress,
    owner
  };
};

module.exports = {
  registerOnBlockchain,
  transferOnBlockchain,
  verifyOnBlockchain
};
