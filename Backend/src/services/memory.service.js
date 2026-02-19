const { PutObjectCommand, DeleteObjectCommand , GetObjectCommand} = require("@aws-sdk/client-s3");
const s3 = require("../config/storage");
const Memory = require("../models/Memory");
const User = require("../models/User");
const { generateFileHash } = require("../utils/hashGenerator");
const { generateSignedUrl } = require("../utils/signedUrl");
const archiver = require("archiver");

/* =====================================================
   Upload Memory (Multiple Images)
===================================================== */
const uploadMemory = async (userId, body, files) => {
  if (!files || files.length === 0) {
    throw new Error("At least one image is required");
  }

  const user = await User.findById(userId);
  if (!user || !user.family) {
    throw new Error("User must belong to a family");
  }

  const uploadedImages = [];

  for (const file of files) {
    const fileHash = generateFileHash(file.buffer);

    const existing = await Memory.findOne({
      "images.fileHash": fileHash
    });

    let s3Key;

    if (existing) {
      const existingImg = existing.images.find(
        img => img.fileHash === fileHash
      );
      s3Key = existingImg.s3Key;
    } else {
      s3Key = `memories/${Date.now()}-${file.originalname}`;

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: s3Key,
          Body: file.buffer,
          ContentType: file.mimetype
        })
      );
    }

    uploadedImages.push({ s3Key, fileHash });
  }

  const memory = await Memory.create({
    title: body.title,
    description: body.description,
    images: uploadedImages,
    uploadedBy: userId,
    family: user.family
  });

  return memory;
};

/* =====================================================
   Get Family Memories
===================================================== */
const getFamilyMemories = async (userId, query) => {
  const user = await User.findById(userId);

  if (!user || !user.family) {
    throw new Error("User must belong to a family");
  }

  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 5;
  const skip = (page - 1) * limit;

  const filter = { family: user.family };

  const total = await Memory.countDocuments(filter);

  const memories = await Memory.find(filter)
    .populate("uploadedBy", "name email")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const memoriesWithUrls = await Promise.all(
    memories.map(async (memory) => {
      const imagesWithUrls = await Promise.all(
        memory.images.map(async (img) => ({
          ...img.toObject(),
          imageUrl: await generateSignedUrl(img.s3Key)
        }))
      );

      return {
        ...memory.toObject(),
        images: imagesWithUrls
      };
    })
  );

  return {
    total,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    limit,
    data: memoriesWithUrls
  };
};

/* =====================================================
   Update Memory (Add Images + Update Text)
===================================================== */
const updateMemory = async (userId, memoryId, body, files) => {
  const memory = await Memory.findById(memoryId);

  if (!memory) {
    throw new Error("Memory not found");
  }

  if (memory.uploadedBy.toString() !== userId.toString()) {
    throw new Error("You are not allowed to update this memory");
  }

  memory.title = body.title || memory.title;
  memory.description = body.description || memory.description;

  // Add new images if provided
  if (files && files.length > 0) {
    for (const file of files) {
      const fileHash = generateFileHash(file.buffer);

      const existing = await Memory.findOne({
        "images.fileHash": fileHash
      });

      let s3Key;

      if (existing) {
        const existingImg = existing.images.find(
          img => img.fileHash === fileHash
        );
        s3Key = existingImg.s3Key;
      } else {
        s3Key = `memories/${Date.now()}-${file.originalname}`;

        await s3.send(
          new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: s3Key,
            Body: file.buffer,
            ContentType: file.mimetype
          })
        );
      }

      memory.images.push({ s3Key, fileHash });
    }
  }

  await memory.save();

  return memory;
};

/* =====================================================
   Delete Single Image Inside Memory
===================================================== */
const deleteMemoryImage = async (userId, memoryId, index) => {
  const memory = await Memory.findById(memoryId);

  if (!memory) {
    throw new Error("Memory not found");
  }

  if (memory.uploadedBy.toString() !== userId.toString()) {
    throw new Error("You are not allowed to modify this memory");
  }

  const image = memory.images[index];

  if (!image) {
    throw new Error("Image not found");
  }

  const duplicateCount = await Memory.countDocuments({
    "images.fileHash": image.fileHash
  });

  memory.images.splice(index, 1);
  await memory.save();

  if (duplicateCount === 1) {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: image.s3Key
      })
    );
  }

  return { message: "Image deleted successfully" };
};

/* =====================================================
   Generate Fresh Download URL (Single Image)
===================================================== */
const downloadMemoryImage = async (userId, memoryId, index) => {
  const memory = await Memory.findById(memoryId);

  if (!memory) {
    throw new Error("Memory not found");
  }

  const image = memory.images[index];

  if (!image) {
    throw new Error("Image not found");
  }

  // 🔥 Generate URL with forced download
  const freshUrl = await generateSignedUrl(
    image.s3Key,
    3600,
    true   // 👈 force download
  );

  return freshUrl;
};


const downloadAllImages = async (userId, memoryId, res) => {
  const memory = await Memory.findById(memoryId);

  if (!memory) {
    throw new Error("Memory not found");
  }

  // 🔒 Optional: restrict to uploader only
  if (memory.uploadedBy.toString() !== userId.toString()) {
    throw new Error("You are not allowed to download this memory");
  }

  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${memory.title.replace(/\s+/g, "_")}.zip`
  );
  res.setHeader("Content-Type", "application/zip");

  const archive = archiver("zip", {
    zlib: { level: 9 }
  });

  archive.pipe(res);

  for (let i = 0; i < memory.images.length; i++) {
    const img = memory.images[i];

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: img.s3Key
    });

    const s3Object = await s3.send(command);

    archive.append(s3Object.Body, {
      name: `image-${i + 1}.jpg`
    });
  }

  await archive.finalize();
};




/* =====================================================
   Delete Full Memory
===================================================== */
const deleteMemory = async (userId, memoryId) => {
  const memory = await Memory.findById(memoryId);

  if (!memory) {
    throw new Error("Memory not found");
  }

  if (memory.uploadedBy.toString() !== userId.toString()) {
    throw new Error("You are not allowed to delete this memory");
  }

  for (const img of memory.images) {
    const duplicateCount = await Memory.countDocuments({
      "images.fileHash": img.fileHash
    });

    if (duplicateCount === 1) {
      await s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: img.s3Key
        })
      );
    }
  }

  await Memory.findByIdAndDelete(memoryId);

  return { message: "Memory deleted successfully" };
};

module.exports = {
  uploadMemory,
  getFamilyMemories,
  updateMemory,
  deleteMemoryImage,
  deleteMemory,
  downloadMemoryImage,
  downloadAllImages
};
