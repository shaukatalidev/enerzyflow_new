"use client";

import { CldUploadWidget, CldImage } from 'next-cloudinary';
import { ReactNode } from 'react';

// Define the exact source types based on Cloudinary documentation
type CloudinarySource = 
  | "camera" 
  | "dropbox" 
  | "facebook" 
  | "gettyimages" 
  | "google_drive" 
  | "image_search" 
  | "instagram" 
  | "istock" 
  | "local" 
  | "shutterstock" 
  | "unsplash" 
  | "url";

// Define proper type for Cloudinary upload result
interface CloudinaryUploadResult {
  event?: string;
  info?: {
    secure_url?: string;
    public_id?: string;
    format?: string;
    width?: number;
    height?: number;
    [key: string]: unknown;
  };
}

// Define proper type for upload options
interface CloudinaryUploadOptions {
  multiple?: boolean;
  maxFiles?: number;
  sources?: CloudinarySource[];
  clientAllowedFormats?: string[];
  maxImageFileSize?: number;
  maxVideoFileSize?: number;
  folder?: string;
  tags?: string[];
  resourceType?: string;
  [key: string]: unknown;
}

// Define types for upload widget props
interface CloudinaryUploadWidgetProps {
  onSuccess: (result: CloudinaryUploadResult) => void;
  children: ({ open }: { open: () => void }) => ReactNode;
  uploadPreset?: string;
  options?: CloudinaryUploadOptions;
}

// ✅ FIX: Simplified interface - let Cloudinary handle complex types via index signature
interface CloudinaryImageProps {
  src: string;
  width: number;
  height: number;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
  quality?: number;
  // ✅ Removed crop and gravity - they have complex types in Cloudinary
  [key: string]: unknown; // Allow additional Cloudinary props
}

// Upload Widget Wrapper
export const CloudinaryUploadWidget = ({ 
  onSuccess, 
  children, 
  uploadPreset,
  options = {}
}: CloudinaryUploadWidgetProps) => {
  return (
    <CldUploadWidget
      uploadPreset={uploadPreset || process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
      options={{
        multiple: false,
        maxFiles: 10,
        sources: ["local", "url", "camera"] as CloudinarySource[],
        ...options
      }}
      onSuccess={(result) => {
        onSuccess(result as CloudinaryUploadResult);
      }}
    >
      {children}
    </CldUploadWidget>
  );
};

// Image Display Wrapper  
export const CloudinaryImage = (props: CloudinaryImageProps) => {
  return (
    <CldImage
      {...props}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
};
