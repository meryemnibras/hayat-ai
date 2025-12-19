"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MediaiLogo from "@/components/shared/MediaiLogo";
import { usePortal } from "../../layout";
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight, Check } from "lucide-react";

export default function RegisterPage() {
  const { t, isRTL, language } = usePortal();
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = isRTL ? "الاسم الكامل مطلوب" : "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = isRTL ? "البريد الإلكتروني مطلوب" : "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = isRTL ? "البريد الإلكتروني غير صحيح" : "Invalid email format";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = isRTL ? "رقم الهاتف مطلوب" : "Phone number is required";
    }

    if (!formData.password) {
      newErrors.password = isRTL ? "كلمة المرور مطلوبة" : "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = isRTL
        ? "كلمة المرور يجب أن تكون 8 أحرف على الأقل"
        : "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = isRTL
        ? "كلمات المرور غير متطابقة"
        : "Passwords do not match";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = isRTL
        ? "يجب الموافقة على الشروط والأحكام"
        : "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Replace with actual API call
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });

      if (response.ok) {
        // Redirect to login or dashboard
        router.push("/portal/login?registered=true");
      } else {
        const data = await response.json();
        setErrors({ submit: data.error || (isRTL ? "حدث خطأ أثناء التسجيل" : "Registration failed") });
      }
    } catch (error) {
      setErrors({
        submit: isRTL
          ? "حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى"
          : "Connection error. Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="inline-block">
            <MediaiLogo size="lg" />
          </a>
          <h1 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            {t("register")}
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {isRTL
              ? "أنشئ حسابك للوصول إلى بوابة المريض"
              : "Create your account to access the patient portal"}
          </p>
        </div>

        {/* Register Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                {isRTL ? "الاسم الكامل" : "Full Name"}
              </label>
              <div className="relative">
                <User
                  className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? "right-3" : "left-3"} text-gray-400`}
                  size={20}
                />
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full ${isRTL ? "pr-10 pl-4" : "pl-10 pr-4"} py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all ${
                    errors.fullName
                      ? "border-red-500"
                      : "border-gray-200 dark:border-gray-600"
                  }`}
                  placeholder={isRTL ? "أدخل اسمك الكامل" : "Enter your full name"}
                />
              </div>
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                {isRTL ? "البريد الإلكتروني" : "Email"}
              </label>
              <div className="relative">
                <Mail
                  className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? "right-3" : "left-3"} text-gray-400`}
                  size={20}
                />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full ${isRTL ? "pr-10 pl-4" : "pl-10 pr-4"} py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all ${
                    errors.email
                      ? "border-red-500"
                      : "border-gray-200 dark:border-gray-600"
                  }`}
                  placeholder={isRTL ? "example@email.com" : "example@email.com"}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                {isRTL ? "رقم الهاتف" : "Phone Number"}
              </label>
              <div className="relative">
                <Phone
                  className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? "right-3" : "left-3"} text-gray-400`}
                  size={20}
                />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full ${isRTL ? "pr-10 pl-4" : "pl-10 pr-4"} py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all ${
                    errors.phone
                      ? "border-red-500"
                      : "border-gray-200 dark:border-gray-600"
                  }`}
                  placeholder={isRTL ? "+90 555 123 4567" : "+90 555 123 4567"}
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                {isRTL ? "كلمة المرور" : "Password"}
              </label>
              <div className="relative">
                <Lock
                  className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? "right-3" : "left-3"} text-gray-400`}
                  size={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full ${isRTL ? "pr-10 pl-10" : "pl-10 pr-10"} py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all ${
                    errors.password
                      ? "border-red-500"
                      : "border-gray-200 dark:border-gray-600"
                  }`}
                  placeholder={isRTL ? "8 أحرف على الأقل" : "At least 8 characters"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? "left-3" : "right-3"} text-gray-400 hover:text-gray-600 dark:hover:text-gray-300`}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                {isRTL ? "تأكيد كلمة المرور" : "Confirm Password"}
              </label>
              <div className="relative">
                <Lock
                  className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? "right-3" : "left-3"} text-gray-400`}
                  size={20}
                />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full ${isRTL ? "pr-10 pl-10" : "pl-10 pr-10"} py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-200 dark:border-gray-600"
                  }`}
                  placeholder={isRTL ? "أعد إدخال كلمة المرور" : "Re-enter password"}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? "left-3" : "right-3"} text-gray-400 hover:text-gray-600 dark:hover:text-gray-300`}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                />
              </div>
              <label
                htmlFor="agreeToTerms"
                className={`${isRTL ? "mr-2" : "ml-2"} text-sm text-gray-600 dark:text-gray-400`}
              >
                {isRTL ? (
                  <>
                    أوافق على{" "}
                    <a href="/terms" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
                      الشروط والأحكام
                    </a>{" "}
                    و{" "}
                    <a href="/privacy" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
                      سياسة الخصوصية
                    </a>
                  </>
                ) : (
                  <>
                    I agree to the{" "}
                    <a href="/terms" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
                      Terms and Conditions
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
                      Privacy Policy
                    </a>
                  </>
                )}
              </label>
            </div>
            {errors.agreeToTerms && (
              <p className="text-sm text-red-500">{errors.agreeToTerms}</p>
            )}

            {/* Submit Error */}
            {errors.submit && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <p className="text-sm text-red-600 dark:text-red-400">{errors.submit}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isRTL ? "جاري التسجيل..." : "Registering..."}
                </>
              ) : (
                <>
                  {t("register")}
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isRTL ? "لديك حساب بالفعل؟" : "Already have an account?"}{" "}
              <a
                href="/portal/login"
                className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                {t("login")}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}



