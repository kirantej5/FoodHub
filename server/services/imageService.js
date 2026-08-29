import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

let cloudinaryConfigured = false;

const configureCloudinary = () => {
  if (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  ) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    cloudinaryConfigured = true;
  }
};

configureCloudinary();

export const uploadImage = async (file) => {
  if (!file) return '';

  if (cloudinaryConfigured) {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'foodhub',
      transformation: [{ width: 800, height: 600, crop: 'limit', quality: 'auto' }],
    });
    fs.unlinkSync(file.path);
    return result.secure_url;
  }

  return `/uploads/${path.basename(file.path)}`;
};

export const deleteLocalFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};
