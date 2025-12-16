"use client";

import React from "react";
import Link from "next/link";

interface MediaiLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  variant?: "full" | "icon";
  className?: string;
  href?: string;
  darkMode?: boolean;
}

const sizeConfig = {
  sm: { icon: 28, text: "text-lg", tagline: "text-[8px]" },
  md: { icon: 36, text: "text-xl", tagline: "text-[10px]" },
  lg: { icon: 44, text: "text-2xl", tagline: "text-xs" },
  xl: { icon: 56, text: "text-3xl", tagline: "text-sm" },
};

export default function MediaiLogo({
  size = "md",
  showTagline = false,
  variant = "full",
  className = "",
  href,
  darkMode = false,
}: MediaiLogoProps) {
  const config = sizeConfig[size];
  const iconSize = config.icon;

  const LogoContent = () => (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Icon - M with checkmark */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <defs>
          <linearGradient id={`grad-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22C55E" />
            <stop offset="50%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
        <rect width="40" height="40" rx="10" fill={`url(#grad-${size})`} />
        <path
          d="M10 28V14L16 22L22 14V28"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M12 20L15 24L21 16"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="30" cy="12" r="3" fill="white" opacity="0.8" />
        <circle cx="32" cy="20" r="2" fill="white" opacity="0.5" />
      </svg>

      {/* Text */}
      {variant === "full" && (
        <div className="flex flex-col">
          <div className={`font-bold ${config.text} flex items-center`}>
            <span className="bg-gradient-to-r from-green-600 via-emerald-500 to-cyan-500 bg-clip-text text-transparent">
              Med
            </span>
            <span className={darkMode ? "text-white" : "text-teal-700"}>i</span>
            <span className="bg-gradient-to-r from-teal-600 to-cyan-500 bg-clip-text text-transparent">
              ai
            </span>
            <span className="text-cyan-400 mr-1">.</span>
          </div>
          {showTagline && (
            <span className={`${config.tagline} text-cyan-600 font-medium tracking-wide`}>
              AI Medical Concierge
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="flex items-center hover:opacity-90 transition-opacity">
        <LogoContent />
      </Link>
    );
  }

  return <LogoContent />;
}

// Simple icon-only version
export function MediaiIcon({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="iconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22C55E" />
          <stop offset="50%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="10" fill="url(#iconGrad)" />
      <path
        d="M10 28V14L16 22L22 14V28"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M12 20L15 24L21 16"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="30" cy="12" r="3" fill="white" opacity="0.8" />
      <circle cx="32" cy="20" r="2" fill="white" opacity="0.5" />
    </svg>
  );
}

