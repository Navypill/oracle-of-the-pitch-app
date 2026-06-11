'use client';

import { useState } from "react";
import { getFlagUrl } from "@/lib/flags";

type Props = {
  code: string;
  alt: string;
  fallback?: string;
  className?: string;
};

export default function FlagImage({ code, alt, fallback, className = "" }: Props) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className={`flag-fallback ${className}`} aria-label={alt} role="img">
        {fallback ?? code.toUpperCase()}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- FlagCDN images need plain img elements for html2canvas card capture.
    <img
      className={`flag-image ${className}`}
      src={getFlagUrl(code, "w80")}
      srcSet={`${getFlagUrl(code, "w80")} 1x, ${getFlagUrl(code, "w160")} 2x`}
      width={80}
      height={60}
      alt={alt}
      crossOrigin="anonymous"
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
