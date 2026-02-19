const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../config/storage");

const Heirloom = require("../models/Heirloom");
const User = require("../models/User");

const { generateFileHash } = require("../utils/hashGenerator");
const { generateSignedUrl } = require("../utils/signedUrl");

const {
  registerOnBlockchain,
  transferOnBlockchain,
  verifyOnBlockchain
} = require("./blockchain.service");

/**
 * CREATE HEIRLOOM
 */
const createHeirloom = async (userId, body, file) => {
  if (!file) throw new Error("Image file is required");

  const user = await User.findById(userId);
  if (!user || !user.family)
    throw new Error("User must belong to a family");

  if (!user.walletAddress)
    throw new Error("User has no wallet address");

  const fileHash = generateFileHash(file.buffer);
  const s3Key = `heirlooms/${Date.now()}-${file.originalname}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: s3Key,
      Body: file.buffer,
      ContentType: file.mimetype
    })
  );

  // 🔥 Register on Blockchain
  const blockchainResult = await registerOnBlockchain(fileHash);

  const heirloom = await Heirloom.create({
    title: body.title,
    description: body.description,
    s3Key,
    fileHash,
    blockchainTxHash: blockchainResult.txHash,
    isVerified: blockchainResult.verified,
    uploadedBy: userId,
    family: user.family,
    currentOwner: userId,
    inheritanceType: "manual",
    ownershipHistory: [
      {
        owner: userId,
        receivedAt: new Date()
      }
    ]
  });

  return heirloom;
};

/**
 * GET HEIRLOOMS (Pagination + Search)
 */
const getFamilyHeirlooms = async (userId, query) => {
  const user = await User.findById(userId);
  if (!user || !user.family)
    throw new Error("User must belong to a family");

  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 5;
  const skip = (page - 1) * limit;

  const searchFilter = query.search
    ? { title: { $regex: query.search, $options: "i" } }
    : {};

  const filter = {
    family: user.family,
    ...searchFilter
  };

  const total = await Heirloom.countDocuments(filter);

  const heirlooms = await Heirloom.find(filter)
    .populate("uploadedBy", "name email walletAddress")
    .populate("currentOwner", "name email walletAddress")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const result = await Promise.all(
    heirlooms.map(async (item) => {
      const imageUrl = await generateSignedUrl(item.s3Key);
      return { ...item.toObject(), imageUrl };
    })
  );

  return {
    total,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    limit,
    data: result
  };
};

/**
 * MANUAL TRANSFER
 */
const transferHeirloom = async (userId, heirloomId, nextOwnerId) => {
  const heirloom = await Heirloom.findById(heirloomId);
  if (!heirloom) throw new Error("Heirloom not found");

  if (!heirloom.currentOwner)
    throw new Error("Heirloom has no current owner");

  if (heirloom.currentOwner.toString() !== userId.toString())
    throw new Error("Only current owner can transfer");

  const currentOwner = await User.findById(userId);
  const nextOwner = await User.findById(nextOwnerId);

  if (!nextOwner) throw new Error("Next owner not found");

  if (!nextOwner.walletAddress)
    throw new Error("Next owner has no wallet address");

  if (
    currentOwner.family.toString() !==
    nextOwner.family.toString()
  )
    throw new Error("Transfer allowed only within family");

 if (new Date(nextOwner.dateOfBirth) <= new Date(currentOwner.dateOfBirth))
  throw new Error("Next owner must be younger than current owner");

  // 🔥 Blockchain transfer
  await transferOnBlockchain(
    heirloom.fileHash,
    nextOwner.walletAddress
  );

  heirloom.currentOwner = nextOwner._id;
  heirloom.inheritanceType = "manual";
  heirloom.nextOwner = null;
  heirloom.transferDate = null;

  heirloom.ownershipHistory.push({
    owner: nextOwner._id,
    receivedAt: new Date()
  });

  await heirloom.save();

  return heirloom;
};

/**
 * SCHEDULE TRANSFER
 */
const scheduleTransfer = async (
  userId,
  heirloomId,
  nextOwnerId,
  transferDate
) => {
  const heirloom = await Heirloom.findById(heirloomId);
  if (!heirloom) throw new Error("Heirloom not found");

  if (heirloom.currentOwner.toString() !== userId.toString())
    throw new Error("Only current owner can schedule");

  const currentOwner = await User.findById(userId);
  const nextOwner = await User.findById(nextOwnerId);

  if (!nextOwner) throw new Error("Next owner not found");

  if (!nextOwner.walletAddress)
    throw new Error("Next owner has no wallet address");

  if (
    currentOwner.family.toString() !==
    nextOwner.family.toString()
  )
    throw new Error("Transfer allowed only within family");

  if (new Date(nextOwner.dateOfBirth) <= new Date(currentOwner.dateOfBirth))
  throw new Error("Next owner must be younger than current owner");

  if (new Date(transferDate) <= new Date())
    throw new Error("Transfer date must be in future");

  heirloom.inheritanceType = "time-based";
  heirloom.nextOwner = nextOwner._id;
  heirloom.transferDate = new Date(transferDate);

  await heirloom.save();

  return heirloom;
};

/**
 * VERIFY HEIRLOOM
 */
const verifyHeirloom = async (userId, heirloomId) => {
  const heirloom = await Heirloom.findById(heirloomId);
  if (!heirloom) throw new Error("Heirloom not found");

  const verification = await verifyOnBlockchain(heirloom.fileHash);

  heirloom.isVerified = verification.verified;
  await heirloom.save();

  return verification;
};

/**
 * UPDATE HEIRLOOM
 */

const updateHeirloom = async (userId, heirloomId, body, file) => {
  const heirloom = await Heirloom.findById(heirloomId);

  if (!heirloom) {
    throw new Error("Heirloom not found");
  }

  if (heirloom.currentOwner.toString() !== userId.toString()) {
    throw new Error("Not authorized to update this heirloom");
  }

  // Update text fields
  heirloom.title = body.title || heirloom.title;
  heirloom.description = body.description || heirloom.description;

  // 🔥 If new image uploaded
  if (file) {
    const newKey = `heirlooms/${Date.now()}-${file.originalname}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: newKey,
        Body: file.buffer,
        ContentType: file.mimetype
      })
    );

    // Delete old image from S3
    if (heirloom.s3Key) {
      await s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: heirloom.s3Key
        })
      );
    }

    heirloom.s3Key = newKey;
  }

  await heirloom.save();

  return heirloom;
};


/**
 * DELETE HEIRLOOM
 */
const deleteHeirloom = async (userId, heirloomId) => {
  const heirloom = await Heirloom.findById(heirloomId);
  if (!heirloom) throw new Error("Heirloom not found");

  if (heirloom.currentOwner.toString() !== userId.toString())
    throw new Error("Not allowed");

  await s3.send(
    new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: heirloom.s3Key
    })
  );

  await Heirloom.findByIdAndDelete(heirloomId);

  return { message: "Heirloom deleted successfully" };
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
