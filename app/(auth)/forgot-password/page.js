"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { z } from "zod";
import Link from "next/link";
import { resetPassword } from "@/lib/actions/authActions";

// Zod validation schema
const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export default function ForgotPasswordPage() {
  const [formData, setFormData] = useState({
    email: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      // Validate form data
      forgotPasswordSchema.parse(formData);

      // Simulate API call
      // await new Promise((resolve) => setTimeout(resolve, 2000));
      await resetPassword(formData.email)

      console.log("Password reset email sent to:", formData.email);
      setIsEmailSent(true);
      // Handle successful submission here
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-6xl grid lg:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Left Side - Welcome Section */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-secondary to-primary py-8 lg:py-24 px-12 flex flex-col justify-center text-white relative overflow-hidden"
        >
          {/* Back Button */}
          <Link href="/login" className="absolute top-8 left-8 p-2 hover:bg-white/20 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>

          {/* Decorative circles */}
          <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-sm" />
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-white/10 rounded-full blur-sm" />

          <div className="relative z-10">
            {/* Logo */}
            <motion.div
              variants={itemVariants}
              className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-8 mx-auto lg:mx-0"
            >
              <img src="/favicon/favicon.svg" width={64} height={64} alt="farahgpt-logo" className="inline" />
            </motion.div>

            <motion.div variants={itemVariants} className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-5xl text-white font-bold mb-4">
                Reset Your
                <br />
                <span className="text-accent">Password</span>
              </h1>
              <p className="text-lg text-emerald-100 max-w-md">
                Don't worry, it happens to the best of us. Enter your email address and we'll send you a link to reset
                your password.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Side - Form Section */}
        <motion.div variants={itemVariants} className="p-8 lg:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            {!isEmailSent ? (
              <>
                <motion.div variants={itemVariants} className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Forgot Password?</h2>
                  <p className="text-gray-600">Enter your email to receive a reset link</p>
                </motion.div>

                <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-6">
                  {/* Email */}
                  <div>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary w-5 h-5" />
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none transition-colors ${
                          errors.email
                            ? "border-red-300 focus:border-red-500"
                            : "border-gray-200 focus:border-secondary"
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-1 ml-1"
                      >
                        {errors.email}
                      </motion.p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-secondary to-primary text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending Reset Link...</span>
                      </div>
                    ) : (
                      "Send Reset Link"
                    )}
                  </motion.button>

                  {/* Back to Login Link */}
                  <motion.div variants={itemVariants} className="text-center">
                    <p className="text-gray-600">
                      Remember your password?{" "}
                      <Link href="/login" className="text-primary hover:text-secondary font-semibold transition-colors">
                        Back to Login
                      </Link>
                    </p>
                  </motion.div>
                </motion.form>
              </>
            ) : (
              /* Success State */
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center space-y-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="flex justify-center"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Check Your Email</h2>
                  <p className="text-gray-600 mb-4">We've sent a password reset link to</p>
                  <p className="text-secondary font-semibold text-lg">{formData.email}</p>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Didn't receive the email?</strong>
                    <br />
                    Check your spam folder or{" "}
                    <button
                      onClick={() => setIsEmailSent(false)}
                      className="text-blue-600 hover:text-blue-800 font-semibold underline"
                    >
                      try again
                    </button>
                  </p>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-4">
                  <Link
                    href="/login"
                    className="block w-full bg-gradient-to-r from-secondary to-primary text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 text-center"
                  >
                    Return to Login
                  </Link>

                  <p className="text-gray-600 text-sm">
                    Need help?{" "}
                    <Link href="/support" className="text-primary hover:text-secondary font-semibold transition-colors">
                      Contact Support
                    </Link>
                  </p>
                </motion.div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
