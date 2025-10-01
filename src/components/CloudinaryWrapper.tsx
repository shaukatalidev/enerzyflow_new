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

// Define types for upload widget props
interface CloudinaryUploadWidgetProps {
  onSuccess: (result: any) => void;
  children: ({ open }: { open: () => void }) => ReactNode;
  uploadPreset?: string;
  options?: {
    multiple?: boolean;
    maxFiles?: number;
    sources?: CloudinarySource[];
    [key: string]: any;
  };
}

// Define types for image wrapper props  
interface CloudinaryImageProps {
  src: string;
  width: number;
  height: number;
  alt: string;
  [key: string]: any;
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
        onSuccess(result);
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
