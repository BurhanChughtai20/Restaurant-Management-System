import { v2 as cloudinary } from "cloudinary";
import type { UploadApiOptions } from "cloudinary";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  throw new Error("Missing Cloudinary environment variables.");
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

export async function uploadImage(
  file: string | Buffer,
  options?: Partial<UploadApiOptions>
): Promise<string> {
  try {
    const defaultOptions: UploadApiOptions = {
      folder: "uploads",
      resource_type: "image",
      use_filename: true,
      unique_filename: true,
      overwrite: false,
      ...options,
    };

    const uploadFile = Buffer.isBuffer(file)
      ? `data:image/jpeg;base64,${file.toString("base64")}`
      : file;

    const result = await cloudinary.uploader.upload(uploadFile, defaultOptions);
    return result.secure_url;
  } catch (err: any) {
    throw new Error("Image upload failed: " + err.message);
  }
}

export async function deleteImage(publicId: string) {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err: any) {
    throw new Error("Image deletion failed: " + err.message);
  }
}

export function getImageUrl(publicId: string, options?: Partial<UploadApiOptions>) {
  return cloudinary.url(publicId, options);
}
