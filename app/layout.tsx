import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// import { ClerkProvider } from "@clerk/nextjs"; // Temporarily disabled
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hayat AI | منصة العيادات التجميلية",
  description:
    "منصة موحدة لإدارة العيادات التجميلية مدعومة بالذكاء الاصطناعي والحجوزات المؤتمتة.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
