"use client";

import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  className?: string;
  href?: string;
}

const sizeClasses = {
  sm: { logo: "h-8", text: "text-lg", tagline: "text-[8px]" },
  md: { logo: "h-10", text: "text-xl", tagline: "text-[10px]" },
  lg: { logo: "h-14", text: "text-2xl", tagline: "text-xs" },
  xl: { logo: "h-20", text: "text-4xl", tagline: "text-sm" },
};

export default function Logo({
  size = "md",
  showTagline = false,
  className = "",
  href = "/",
}: LogoProps) {
  const sizes = sizeClasses[size];

  const LogoContent = () => (
    <div className={`flex items-center ${className}`}>
      {/* Try to load PNG first, fallback to SVG */}
      <div className="relative">
        <Image
          src="/images/logo.svg"
          alt="Mediai Logo"
          width={size === "xl" ? 200 : size === "lg" ? 150 : size === "md" ? 120 : 100}
          height={size === "xl" ? 60 : size === "lg" ? 45 : size === "md" ? 36 : 30}
          className={`${sizes.logo} w-auto object-contain`}
          priority
          onError={(e) => {
            // Fallback to SVG if PNG fails
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
            const fallback = target.nextElementSibling as HTMLElement;
            if (fallback) fallback.style.display = "flex";
          }}
        />
        {/* SVG Fallback */}
        <div className="hidden items-center" style={{ display: "none" }}>
          <LogoSVG size={size} />
        </div>
      </div>
      {showTagline && (
        <span
          className={`${sizes.tagline} text-cyan-600 font-medium mt-1 tracking-wide`}
        >
          AI Medical Concierge
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="flex flex-col items-start">
        <LogoContent />
      </Link>
    );
  }

  return (
    <div className="flex flex-col items-start">
      <LogoContent />
    </div>
  );
}

// SVG Fallback Component
function LogoSVG({ size = "md" }: { size?: "sm" | "md" | "lg" | "xl" }) {
  const height = size === "xl" ? 50 : size === "lg" ? 40 : size === "md" ? 32 : 24;

  return (
    <svg
      viewBox="0 0 180 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ height: `${height}px`, width: "auto" }}
    >
      <defs>
        <linearGradient
          id="logoGradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#22C55E" />
          <stop offset="50%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>

      {/* Stylized M with checkmark */}
      <path
        d="M5 40V15L15 30L25 15V40"
        stroke="url(#logoGradient)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M8 25L12 30L22 18"
        stroke="url(#logoGradient)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* "ediai" text */}
      <text
        x="35"
        y="35"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="28"
        fontWeight="600"
        fill="#0F766E"
      >
        ediai
      </text>

      {/* Decorative dots */}
      <circle cx="155" cy="15" r="4" fill="#22D3EE" />
      <circle cx="170" cy="25" r="3" fill="#10B981" />
    </svg>
  );
}

// Simple Logo Icon (for sidebar/small spaces)
export function LogoIcon({ className = "" }: { className?: string }) {
  return (
    <div
      className={`w-10 h-10 bg-gradient-to-br from-green-500 via-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/25 ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6"
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

