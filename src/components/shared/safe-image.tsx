"use client";

import { useMemo, useState } from "react";
import Image, { type ImageProps } from "next/image";

import { cn } from "@/lib/utils";

type SafeImageProps = Omit<ImageProps, "src" | "onError"> & {
  src?: string | null;
  fallbackClassName?: string;
};

const allowedRemoteHosts = [
  "images.unsplash.com",
  "images.pexels.com",
  "firebasestorage.googleapis.com",
  "storage.googleapis.com",
];

function isSafeNextImageSrc(src: string) {
  if (src.startsWith("/") || src.startsWith("data:") || src.startsWith("blob:")) {
    return true;
  }

  try {
    const { hostname } = new URL(src);
    return allowedRemoteHosts.includes(hostname) || hostname.endsWith(".supabase.co");
  } catch {
    return false;
  }
}

export function SafeImage({
  src,
  alt,
  className,
  fallbackClassName,
  ...props
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);
  const safeSrc = useMemo(() => (src ? src.trim() : ""), [src]);

  if (!safeSrc || failed) {
    return <div className={cn("absolute inset-0 bg-grid opacity-50", fallbackClassName)} />;
  }

  if (!isSafeNextImageSrc(safeSrc)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={safeSrc}
        alt={alt}
        className={cn("absolute inset-0 h-full w-full object-cover", className)}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <Image
      {...props}
      src={safeSrc}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
