"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadProfileImage } from "@/lib/cloudinary/upload-image";
import { getInitials } from "@/lib/user/display";
import { cn } from "@/lib/utils";

type ProfileImageFieldProps = {
  imageUrl: string;
  onChange: (url: string) => void;
  displayName: string;
  disabled?: boolean;
  className?: string;
};

export function ProfileImageField({
  imageUrl,
  onChange,
  displayName,
  disabled = false,
  className,
}: ProfileImageFieldProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const previewSrc = localPreview || imageUrl.trim() || null;
  const initials = getInitials(displayName || "Student");

  useEffect(() => {
    return () => {
      if (localPreview) {
        URL.revokeObjectURL(localPreview);
      }
    };
  }, [localPreview]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploadError(null);
    let objectUrl: string | null = null;
    try {
      objectUrl = URL.createObjectURL(file);
      setLocalPreview((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return objectUrl;
      });

      setUploading(true);
      const secureUrl = await uploadProfileImage(file);
      onChange(secureUrl);
      setLocalPreview((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    } catch (err) {
      setLocalPreview((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      setUploadError(
        err instanceof Error ? err.message : "Could not upload image."
      );
    } finally {
      setUploading(false);
    }
  }

  function handleRemove() {
    setUploadError(null);
    setLocalPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    onChange("");
  }

  return (
    <div className={cn("space-y-3", className)}>
      <p className="text-sm font-medium text-ink">Profile photo</p>
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-full border border-line bg-primary-soft">
          {previewSrc ? (
            <Image
              src={previewSrc}
              alt=""
              fill
              className="object-cover"
              sizes="80px"
              unoptimized={previewSrc.startsWith("blob:")}
            />
          ) : (
            <span
              className="flex size-full items-center justify-center text-lg font-semibold text-primary"
              aria-hidden
            >
              {initials}
            </span>
          )}
          {uploading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-ink/40">
              <Loader2
                className="size-6 animate-spin text-primary-foreground"
                aria-hidden
              />
            </div>
          ) : null}
        </div>

        <div className="flex min-w-0 flex-col gap-2">
          <input
            ref={inputRef}
            id={inputId}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            disabled={disabled || uploading}
            onChange={(e) => void handleFileChange(e)}
          />
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9"
              disabled={disabled || uploading}
              onClick={() => inputRef.current?.click()}
            >
              {uploading ? "Uploading…" : "Choose photo"}
            </Button>
            {imageUrl.trim() || localPreview ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-9 text-muted-foreground"
                disabled={disabled || uploading}
                onClick={handleRemove}
              >
                Remove photo
              </Button>
            ) : null}
          </div>
          <p className="text-xs text-muted-foreground">
            JPEG, PNG, WebP, or GIF. Max 5 MB.
          </p>
          {uploadError ? (
            <p className="text-xs text-destructive" role="alert">
              {uploadError}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
