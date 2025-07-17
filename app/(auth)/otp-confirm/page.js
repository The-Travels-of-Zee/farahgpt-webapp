"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { confirmEmailOTP, completeUserLogin, resendEmailOTP } from "@/lib/actions/authActions";

// Zod validation schema
const otpSchema = z.object({
  otp: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit OTP"),
});

export default function OtpConfirmPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    otp: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpConfirmed, setIsOtpConfirmed] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("user");

  // Get email and type from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get("email");
    const typeParam = urlParams.get("type") || "user";

    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
      setUserType(typeParam);
    } else {
      // Redirect to appropriate signup page if no email
      router.push("/signup-user");
    }
  }, [router]);

  // Countdown for resend button
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleInputChange = (field, value) => {
    // Only allow numbers and limit to 6 digits
    const numericValue = value.replace(/[^0-9]/g, "").slice(0, 6);
    setFormData((prev) => ({ ...prev, [field]: numericValue }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      // Validate OTP format
      otpSchema.parse(formData);
      
      console.log("Verifying OTP for:", email, "Type:", userType);

      // Verify OTP with Supabase (this also creates the user profile)
      const result = await confirmEmailOTP(email, formData.otp);

      if (result.success) {
        console.log("OTP verified successfully, user profile created");
        setIsOtpConfirmed(true);

        // Complete the login process
        const loginResult = await completeUserLogin(result.user, userType);
        
        if (loginResult.success) {
          console.log("Login completed successfully");
          
          // Redirect after a short delay to show success state
          setTimeout(() => {
            if (userType === "instructor") {
              router.push("/instructor/dashboard");
            } else {
              router.push("/learning");
            }
          }, 2000);
        } else {
          console.error("Login completion failed:", loginResult.error);
          setErrors({ otp: "Failed to complete login. Please try again." });
          setIsOtpConfirmed(false);s
        }
      } else {
        console.error("OTP verification failed:", result.error);
        setErrors({ otp: result.error });
      }
    } catch (error) {
      console.error("Handle submit error:", error);
      
      if (error instanceof z.ZodError) {
        const newErrors = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
      } else {
        setErrors({ otp: error.message || "An error occurred. Please try again." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || !email) return;

    setIsResending(true);
    setErrors({});

    try {
      const result = await resendEmailOTP(email);

      if (result.success) {
        setResendCooldown(60); // 60 second cooldown
        // You could add a success toast here
        console.log("OTP resent successfully");
      } else {
        console.error("Resend failed:", result.error);
        setErrors({ otp: result.error });
      }
    } catch (error) {
      console.error("Resend error:", error);
      setErrors({ otp: "Failed to resend code. Please try again." });
    } finally {
      setIsResending(false);
    }
  };

  const getBackLink = () => {
    return userType === "instructor" ? "/signup-instructor" : "/signup-user";
  };

  const getUserTypeDisplay = () => {
    return userType === "instructor" ? "instructor" : "User";
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

  // Don't render if no email (will redirect)
  if (!email) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-6xl grid lg:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Left Side */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-secondary to-primary py-8 lg:py-24 px-12 flex flex-col justify-center text-white relative overflow-hidden"
        >
          <Link
            href={getBackLink()}
            className="absolute top-8 left-8 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>

          <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-sm" />
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-white/10 rounded-full blur-sm" />

          <div className="relative z-10">
            <motion.div
              variants={itemVariants}
              className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-8 mx-auto lg:mx-0"
            >
              <img src="/favicon/favicon.svg" width={64} height={64} alt="logo" />
            </motion.div>

            <motion.div variants={itemVariants} className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                Verify Your
                <br />
                <span className="text-accent">Email</span>
              </h1>
              <p className="text-lg text-emerald-100 max-w-md">
                We've sent a 6-digit verification code to <span className="font-semibold">{email}</span>. Enter it below
                to activate your {getUserTypeDisplay().toLowerCase()} account.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Side */}
        <motion.div variants={itemVariants} className="p-8 lg:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            {!isOtpConfirmed ? (
              <>
                <motion.div variants={itemVariants} className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Enter OTP</h2>
                  <p className="text-gray-600">
                    Enter the 6-digit code sent to your email to verify your {getUserTypeDisplay().toLowerCase()}{" "}
                    account
                  </p>
                </motion.div>

                <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-6">
                  {/* OTP Input */}
                  <div>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="Enter 6-digit OTP"
                      value={formData.otp}
                      onChange={(e) => handleInputChange("otp", e.target.value)}
                      className={`w-full text-center text-xl tracking-widest uppercase py-4 border-2 rounded-xl focus:outline-none transition-colors ${
                        errors.otp ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-secondary"
                      }`}
                    />
                    {errors.otp && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-1 ml-1"
                      >
                        {errors.otp}
                      </motion.p>
                    )}
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isLoading || formData.otp.length !== 6}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-secondary to-primary text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Verifying...</span>
                      </div>
                    ) : (
                      "Verify OTP"
                    )}
                  </motion.button>
                </motion.form>

                <motion.div variants={itemVariants} className="text-center mt-6">
                  <p className="text-gray-600 text-sm">
                    Didn't get the code?{" "}
                    <button
                      onClick={handleResend}
                      disabled={isResending || resendCooldown > 0}
                      className="text-primary hover:text-secondary font-semibold underline disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline"
                    >
                      {isResending ? "Sending..." : resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
                    </button>
                  </p>
                </motion.div>
              </>
            ) : (
              // OTP Confirmed State
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
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">{getUserTypeDisplay()} Account Verified!</h2>
                  <p className="text-gray-600 mb-4">
                    Your {getUserTypeDisplay().toLowerCase()} account has been verified successfully. Redirecting you to
                    your dashboard...
                  </p>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-4">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-green-600 font-semibold">Redirecting...</span>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}