import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * دالة لدمج classes مع tailwind-merge
 * تستخدم لدمج classes من Tailwind CSS بشكل صحيح
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}













