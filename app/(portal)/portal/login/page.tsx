"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import MediaiLogo from "@/components/shared/MediaiLogo";
import { usePortal } from "../../layout";
import { Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle } from "lucide-react";

function LoginForm() {
  const { t, isRTL, language } = usePortal();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Show success message if redirected from registration
    if (searchParams.get("registered") === "true") {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }
  }, [searchParams]);

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

    if (!formData.email.trim()) {
      newErrors.email = isRTL ? "البريد الإلكتروني مطلوب" : "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = isRTL ? "البريد الإلكتروني غير صحيح" : "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = isRTL ? "كلمة المرور مطلوبة" : "Password is required";
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
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          rememberMe: formData.rememberMe,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user data if provided
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
        if (data.token) {
          localStorage.setItem("auth_token", data.token);
        }
        // Redirect to portal dashboard
        router.push("/portal");
      } else {
        setErrors({
          submit: data.error || (isRTL ? "البريد الإلكتروني أو كلمة المرور غير صحيحة" : "Invalid email or password"),
        });
      }
    } catch (error) {
      console.error("Login error:", error);
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
            {t("login")}
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {isRTL
              ? "سجل الدخول للوصول إلى بوابة المريض"
              : "Sign in to access the patient portal"}
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
          {/* Success Message */}
          {showSuccess && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-3">
              <CheckCircle className="text-green-600 dark:text-green-400" size={20} />
              <p className="text-sm text-green-600 dark:text-green-400">
                {isRTL
                  ? "تم إنشاء حسابك بنجاح! يمكنك الآن تسجيل الدخول."
                  : "Account created successfully! You can now sign in."}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {isRTL ? "كلمة المرور" : "Password"}
                </label>
                <a
                  href="/portal/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  {isRTL ? "نسيت كلمة المرور؟" : "Forgot password?"}
                </a>
              </div>
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
                  placeholder={isRTL ? "أدخل كلمة المرور" : "Enter your password"}
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

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                />
                <label
                  htmlFor="rememberMe"
                  className={`${isRTL ? "mr-2" : "ml-2"} text-sm text-gray-600 dark:text-gray-400`}
                >
                  {isRTL ? "تذكرني" : "Remember me"}
                </label>
              </div>
            </div>

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
                  {isRTL ? "جاري تسجيل الدخول..." : "Signing in..."}
                </>
              ) : (
                <>
                  {t("login")}
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isRTL ? "ليس لديك حساب؟" : "Don't have an account?"}{" "}
              <a
                href="/portal/register"
                className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                {t("register")}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}

