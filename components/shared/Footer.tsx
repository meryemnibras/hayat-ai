"use client";

import React from "react";
import { Mail, MessageCircle } from "lucide-react";
import MediaiLogo from "./MediaiLogo";
import Link from "next/link";

export default function Footer() {
  const whatsappNumber = "00905362266054";
  const email = "info@mediai.tr";
  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/^00/, "")}`;

  return (
    <footer className="bg-[#1e3a5f] border-t border-blue-800/50 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div className="flex flex-col space-y-4">
            <MediaiLogo size="md" />
            <p className="text-sm text-blue-200">
              2025 MEDI AI Technologies. All rights reserved.
            </p>
            <p className="text-xs text-blue-300/70">
              Designed by Meryem Boulbassir
            </p>
          </div>

          {/* Contact Information */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wide">
              Contact
            </h3>
            <div className="flex flex-col space-y-3">
              {/* WhatsApp */}
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-blue-200 hover:text-green-300 transition-colors group"
              >
                <div className="p-2 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors border border-green-500/30">
                  <MessageCircle className="h-5 w-5 text-green-300" />
                </div>
                <span className="text-sm font-medium">{whatsappNumber}</span>
              </a>

              {/* Email */}
              <a
                href={`mailto:${email}`}
                className="flex items-center space-x-3 text-blue-200 hover:text-blue-100 transition-colors group"
              >
                <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors border border-blue-500/30">
                  <Mail className="h-5 w-5 text-blue-300" />
                </div>
                <span className="text-sm font-medium">{email}</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wide">
              Quick Links
            </h3>
            <div className="flex flex-col space-y-2">
              <Link
                href="/"
                className="text-sm text-blue-200 hover:text-white transition-colors"
              >
                Home
              </Link>
              <Link
                href="/portal"
                className="text-sm text-blue-200 hover:text-white transition-colors"
              >
                Patient Portal
              </Link>
              <Link
                href="/portal/register"
                className="text-sm text-blue-200 hover:text-white transition-colors"
              >
                Register
              </Link>
              <Link
                href="/portal/login"
                className="text-sm text-blue-200 hover:text-white transition-colors"
              >
                Login
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-blue-800/50 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-xs text-blue-200/80 text-center md:text-left">
            © 2025 MEDI AI Technologies. All rights reserved.
          </p>
          <p className="text-xs text-blue-200/80 text-center md:text-right">
            Designed by{" "}
            <span className="text-blue-100 font-medium">Meryem Boulbassir</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

