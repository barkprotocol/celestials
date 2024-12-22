'use client';

import Image from 'next/image';

const LOGO_URL = "https://ucarecdn.com/bbc74eca-8e0d-4147-8a66-6589a55ae8d0/bark.webp";

interface LogoProps {
  width?: number;
  height?: number;
}

export function Logo({ width = 24, height = 24 }: LogoProps) {
  return (
    <div className="flex items-center justify-center">
      <Image
        src={LOGO_URL}
        alt="BARK Logo"
        width={width}
        height={height}
        quality={85}
        className="object-contain"
      />
    </div>
  );
}
