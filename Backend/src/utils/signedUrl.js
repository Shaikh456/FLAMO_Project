const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const s3 = require("../config/storage");

const generateSignedUrl = async (
  key,
  expiresIn = 300,
  forceDownload = false
) => {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,

    // 🔥 Force download if requested
    ResponseContentDisposition: forceDownload
      ? `attachment; filename="${key.split("/").pop()}"`
      : undefined
  });

  return await getSignedUrl(s3, command, { expiresIn });
};

module.exports = { generateSignedUrl };
