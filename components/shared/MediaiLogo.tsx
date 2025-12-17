"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface MediaiLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  href?: string;
}

const sizeConfig = {
  // مقاسات مضبوطة لتناسب الهيدر والفوتر مع اللوجو الأفقي
  sm: { width: 90, height: 26 },
  md: { width: 120, height: 34 },
  lg: { width: 150, height: 42 },
  xl: { width: 190, height: 52 },
};

export default function MediaiLogo({
  size = "md",
  className = "",
  href,
}: MediaiLogoProps) {
  const config = sizeConfig[size];

  const LogoImage = () => (
    <Image
      src="/images/Black_And_White_Aesthetic_Minimalist_Modern_Simple_Typography_Coconut_Cosmetics_Logo__2_-removebg-preview.png"
      alt="Mediai - AI Medical Concierge"
      width={config.width}
      height={config.height}
      className={`object-contain ${className}`}
      priority
      unoptimized
    />
  );

  if (href) {
    return (
      <Link href={href} className="flex items-center hover:opacity-90 transition-opacity">
        <LogoImage />
      </Link>
    );
  }

  return <LogoImage />;
}

// Icon-only version (for collapsed sidebars)
export function MediaiIcon({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <div 
      className={`bg-gradient-to-br from-green-500 via-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size * 0.6}
        height={size * 0.6}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 18V8L9 14L14 8V18"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6 12L8 14.5L13 9"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="18" cy="8" r="2" fill="white" opacity="0.8" />
        <circle cx="20" cy="14" r="1.5" fill="white" opacity="0.6" />
      </svg>
    </div>
  );
}
