"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type BlurImageProps = Omit<ImageProps, "onLoad" | "onError"> & {
  /** Extra classes for the wrapper that holds the skeleton. */
  wrapperClassName?: string;
};

/**
 * next/image with a pulsing skeleton placeholder: the skeleton shows while
 * the image loads, then the image fades in over it. `fill` images rely on
 * the nearest positioned ancestor for layout (same as plain next/image fill).
 */
const BlurImage = ({
  fill,
  className = "",
  wrapperClassName = "",
  ...props
}: BlurImageProps) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <span
      className={`relative overflow-hidden ${
        fill ? "absolute inset-0" : "inline-block align-middle"
      } ${wrapperClassName}`}
    >
      <Image
        {...props}
        fill={fill}
        onLoad={() => setLoaded(true)}
        // Hide the skeleton even if the image fails, so it never pulses forever.
        onError={() => setLoaded(true)}
        className={`${className} transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
      {!loaded && (
        <span
          aria-hidden
          className="absolute inset-0 animate-pulse bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200"
        />
      )}
    </span>
  );
};

export default BlurImage;
