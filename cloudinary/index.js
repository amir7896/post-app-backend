const cloudinary = require("cloudinary").v2;
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

//  Use memory storage
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.startsWith("image") ||
      file.mimetype.startsWith("video")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only images and videos are allowed"), false);
    }
  },
});

//  Upload to Cloudinary (Using Buffer)
const uploadToCloudinary = async (buffer, folder, mimetype) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: mimetype.startsWith("video") ? "video" : "image",
        },
        (error, result) => {
          if (error) {
            console.log("Upload error:", error);
            return reject(error);
          }
          resolve({
            publicId: result.public_id,
            secureUrl: result.secure_url,
            mediaType: result.resource_type,
          });
        }
      )
      .end(buffer);
  });
};

module.exports = { cloudinary, upload, uploadToCloudinary };
