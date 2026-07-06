"use client";

import Image from "next/image";
import { toHttpsAssetUrl } from "@/utils/secureAssetUrl";

type TourThumbImageProps = {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
};

/** Remote tour thumbnail via next/image (API URLs are not known at build time). */
export default function TourThumbImage({
  src,
  alt,
  className,
  width = 640,
  height = 360,
  style,
}: TourThumbImageProps) {
  const normalizedSrc = toHttpsAssetUrl(src);
  if (!normalizedSrc) return null;

  return (
    <Image
      unoptimized
      src={normalizedSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
    />
  );
}
