"use client";

import { useState, useEffect } from "react";
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { changePassword } from "@/lib/actions/authActions";
import supabase from "@/lib/supabase/supabase";

// Zod validation schema
const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function ResetPasswordPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [isValidSession, setIsValidSession] = useState(null);
  const [sessionError, setSessionError] = useState("");

  // Extract tokens from URL hash and set session
  useEffect(() => {
    const handlePasswordReset = async () => {
      try {
        const hash = window.location.hash;

        if (!hash) {
          setIsValidSession(false);
          setSessionError("No authentication data found in URL");
          return;
        }

        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");

        if (!accessToken || !refreshToken) {
          setIsValidSession(false);
          setSessionError("Invalid authentication data");
          return;
        }

        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          console.error("Session error:", error);
          setIsValidSession(false);
          setSessionError(error.message || "Failed to authenticate");
          return;
        }

        if (data.session) {
          setIsValidSession(true);
          window.history.replaceState({}, document.title, window.location.pathname);
        } else {
          setIsValidSession(false);
          setSessionError("No valid session found");
        }
      } catch (error) {
        console.error("Error handling password reset:", error);
        setIsValidSession(false);
        setSessionError("An error occurred while processing the reset link");
      }
    };

    handlePasswordReset();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      resetPasswordSchema.parse(formData);

      const result = await changePassword(formData.password);

      if (result.success) {
        console.log("Password reset successful");
        setIsPasswordReset(true);

        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setErrors({ submit: result.error || "Failed to reset password" });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
      } else {
        setErrors({ submit: "An unexpected error occurred" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (isValidSession === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Verifying Reset Link</h2>
          <p className="text-gray-600">Please wait while we verify your password reset link...</p>
        </div>
      </div>
    );
  }

  // Invalid session state
  if (isValidSession === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Invalid Reset Link</h2>
          <p className="text-gray-600 mb-4">
            {sessionError || "This password reset link is invalid or has expired. Please request a new password reset."}
          </p>
          <Link
            href="/forgot-password"
            className="block w-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg mb-3"
          >
            Request New Reset Link
          </Link>
          <Link
            href="/login"
            className="block w-full border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold transition-all duration-300 hover:bg-gray-50"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Left Side - Welcome Section */}
        <div className="bg-gradient-to-br from-secondary to-primary py-12 px-8 lg:py-24 lg:px-12 text-white relative overflow-hidden flex flex-col justify-center">
          {/* Back Button (optional) */}
          <Link href="/" className="absolute top-8 left-8 p-2 hover:bg-white/20 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>

          {/* Decorative Circles */}
          <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-sm" />
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-white/10 rounded-full blur-sm" />

          <div className="relative z-10">
            {/* Logo */}
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-8">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                <Lock className="w-6 h-6 text-white" />
              </div>
            </div>

            <div className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                Create New
                <br />
                <span className="text-accent">Password</span>
              </h1>
              <p className="text-lg text-emerald-100 max-w-md">
                You're almost there! Create a strong new password to secure your account and regain access to all your
                features.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Form Section */}
        <div className="p-8 lg:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md mx-auto w-full">
            {!isPasswordReset ? (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Reset Password</h2>
                  <p className="text-gray-600">Enter your new password below</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary w-5 h-5" />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl focus:outline-none transition-colors text-gray-900 bg-white placeholder-gray-400 ${
                          errors.password
                            ? "border-red-300 focus:border-red-500"
                            : "border-gray-200 focus:border-secondary"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-secondary transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-sm mt-1 ml-1">{errors.password}</p>}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary w-5 h-5" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl focus:outline-none transition-colors text-gray-900 bg-white placeholder-gray-400 ${
                          errors.confirmPassword
                            ? "border-red-300 focus:border-red-500"
                            : "border-gray-200 focus:border-secondary"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-secondary transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1 ml-1">{errors.confirmPassword}</p>
                    )}
                  </div>

                  {/* Password Requirements */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800 font-semibold mb-2">Password Requirements:</p>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• At least 8 characters long</li>
                      <li>• Use a mix of letters, numbers, and symbols</li>
                      <li>• Avoid common words or personal info</li>
                    </ul>
                  </div>

                  {/* Submit Error */}
                  {errors.submit && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-600 text-sm">{errors.submit}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-secondary to-primary text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Resetting Password...</span>
                      </div>
                    ) : (
                      "Reset Password"
                    )}
                  </button>
                </form>
              </>
            ) : (
              /* Success State */
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">Password Reset Successful!</h2>
                  <p className="text-gray-600 mb-4">
                    Your password has been successfully reset. You can now log in with your new password.
                  </p>
                  <p className="text-sm text-gray-500">You will be redirected to the login page in a few seconds...</p>
                </div>

                <Link
                  href="/login"
                  className="block w-full bg-gradient-to-r from-secondary to-primary text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 text-center hover:scale-105"
                >
                  Go to Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
