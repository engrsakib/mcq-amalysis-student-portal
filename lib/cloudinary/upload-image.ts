"use client";

import {
  getCloudinaryCloudName,
  getCloudinaryUploadPreset,
  PROFILE_IMAGE_ACCEPTED_TYPES,
  PROFILE_IMAGE_MAX_BYTES,
} from "@/lib/cloudinary/public-config";

type CloudinaryUploadResponse = {
  secure_url?: string;
  error?: { message?: string };
};

export function validateProfileImageFile(file: File): string | null {
  if (
    !PROFILE_IMAGE_ACCEPTED_TYPES.includes(
      file.type as (typeof PROFILE_IMAGE_ACCEPTED_TYPES)[number]
    )
  ) {
    return "Use a JPEG, PNG, WebP, or GIF image.";
  }
  if (file.size > PROFILE_IMAGE_MAX_BYTES) {
    return "Image must be 5 MB or smaller.";
  }
  return null;
}

export async function uploadProfileImage(file: File): Promise<string> {
  const validationError = validateProfileImageFile(file);
  if (validationError) {
    throw new Error(validationError);
  }

  let cloudName: string;
  let uploadPreset: string;
  try {
    cloudName = getCloudinaryCloudName();
    uploadPreset = getCloudinaryUploadPreset();
  } catch (err) {
    throw err instanceof Error
      ? err
      : new Error("Cloudinary is not configured.");
  }

  const body = new FormData();
  body.append("file", file);
  body.append("upload_preset", uploadPreset);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`,
    { method: "POST", body }
  );

  let json: CloudinaryUploadResponse;
  try {
    json = (await res.json()) as CloudinaryUploadResponse;
  } catch {
    throw new Error("Could not read Cloudinary response.");
  }

  if (!res.ok) {
    throw new Error(
      json.error?.message ||
        `Upload failed (${res.status}). Check cloud name and upload preset.`
    );
  }

  const url = json.secure_url?.trim();
  if (!url) {
    throw new Error("Cloudinary did not return an image URL.");
  }

  return url;
}
