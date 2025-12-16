'use client';

import VideoPlayer from "@/components/Vedio"; 
import CustomCursor from "@/components/CustomCursor";

export default function VideoPage() {
  return (
    <>
    <div className="mt-20">
      <CustomCursor />
      <VideoPlayer />
      </div>
    </>
  );
}
