export const PROFILE_IMAGE_MAX_BYTES = 5 * 1024 * 1024;

export const PROFILE_IMAGE_ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export function getCloudinaryCloudName(): string {
  const value = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim();
  if (!value) {
    throw new Error(
      "Cloudinary is not configured. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME."
    );
  }
  return value;
}

export function getCloudinaryUploadPreset(): string {
  const value = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET?.trim();
  if (!value) {
    throw new Error(
      "Cloudinary upload preset is not configured. Set NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET."
    );
  }
  return value;
}
