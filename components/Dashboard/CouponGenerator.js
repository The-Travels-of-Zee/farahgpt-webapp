"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Copy, RefreshCw, Check, Gift, Trash2 } from "lucide-react";
import { z } from "zod";
import { createCouponCode, fetchInstructorCoupons, deleteCouponCode } from "@/lib/actions/couponActions";
import useUserStore from "@/store/userStore";
import useCouponStore from "@/store/couponStore";

const CouponSchema = z.object({
  code: z.string().min(6, "Code must be at least 6 characters"),
  discount: z.number().min(1).max(100),
  user_id: z.string().uuid("Invalid user ID"),
});

const CouponGenerator = () => {
  const { user, isLoggedIn } = useUserStore();
  const {
    coupons: existingCoupons,
    addCoupon,
    removeCoupon,
    setCoupons,
    setLoading,
    isLoading,
    shouldRefetch,
  } = useCouponStore();
  const [generatedCode, setGeneratedCode] = useState("");
  const [couponName, setCouponName] = useState("");
  const [discount, setDiscount] = useState(10);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch existing coupons on component mount
  useEffect(() => {
    if (isLoggedIn && user?.id && shouldRefetch()) {
      fetchExistingCoupons();
    }
  }, [isLoggedIn, user?.id]);

  const fetchExistingCoupons = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const result = await fetchInstructorCoupons(user.id);
      if (result.success) {
        setCoupons(result.data);
      } else {
        setError(result.error || "Failed to fetch existing coupons");
      }
    } catch (err) {
      setError("Failed to fetch existing coupons");
    } finally {
      setLoading(false);
    }
  };

  const generateRandomCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const generateCoupon = async () => {
    if (!isLoggedIn || !user?.id) {
      setError("Please log in to generate coupons");
      return;
    }

    setIsGenerating(true);
    setError("");
    setSuccess("");

    try {
      let newCode;
      let attempts = 0;
      const maxAttempts = 50;
      const existingCodes = existingCoupons.map((coupon) => coupon.code);

      do {
        if (couponName.length > 0) {
          newCode = couponName.toUpperCase().trim().replace(/\s+/g, "");
          // Add random suffix if name is too short
          if (newCode.length < 6) {
            newCode += generateRandomCode().substring(0, 6 - newCode.length);
          }
        } else {
          newCode = generateRandomCode();
        }
        attempts++;
      } while (existingCodes.includes(newCode) && attempts < maxAttempts);

      if (attempts >= maxAttempts) {
        throw new Error("Unable to generate unique coupon code. Please try a different name.");
      }

      // Validate with Zod
      const couponData = {
        code: newCode,
        discount: Number(discount),
        user_id: user.id,
      };

      CouponSchema.parse(couponData);

      // Create coupon in database
      const result = await createCouponCode(couponData);

      if (result.success) {
        setGeneratedCode(newCode);
        setSuccess("Coupon created successfully!");
        setCouponName(""); // Clear the input

        // Add the new coupon to the store
        addCoupon(result.data);
      } else {
        throw new Error(result.error || "Failed to create coupon");
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        setError(err.message);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const deleteCoupon = async (couponId) => {
    try {
      const result = await deleteCouponCode(couponId);
      if (result.success) {
        setSuccess("Coupon deleted successfully!");
        // Remove from store
        removeCoupon(couponId);
      } else {
        setError(result.error || "Failed to delete coupon");
      }
    } catch (err) {
      setError("Failed to delete coupon");
    }
  };

  const copyToClipboard = async () => {
    if (generatedCode) {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-3">
            <Gift className="w-6 h-6 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600">Please log in to generate coupon codes.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
          <Gift className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Coupon Generator</h2>
        <p className="text-gray-600 text-sm">Create unique discount codes for your courses</p>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Coupon Name (Optional)</label>
          <input
            type="text"
            value={couponName}
            onChange={(e) => setCouponName(e.target.value)}
            placeholder="Leave empty for random code"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
          />
          <p className="text-xs text-gray-500 mt-1">Will be converted to uppercase and must be at least 6 characters</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Discount Percentage (%)</label>
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
            min="1"
            max="100"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
          />
        </div>
      </div>

      <motion.button
        onClick={generateCoupon}
        disabled={isGenerating || !isLoggedIn}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
      >
        {isGenerating ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Creating...</span>
          </>
        ) : (
          <>
            <RefreshCw className="w-4 h-4" />
            <span>Generate Coupon</span>
          </>
        )}
      </motion.button>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg"
        >
          <p className="text-red-700 text-sm">{error}</p>
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg"
        >
          <p className="text-green-700 text-sm">{success}</p>
        </motion.div>
      )}

      {generatedCode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-gray-50 rounded-lg border"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Generated Code</span>
            <span className="text-xs text-gray-500">{discount}% off</span>
          </div>

          <div className="flex items-center space-x-2">
            <code className="flex-1 text-lg font-mono font-bold text-blue-600 bg-white px-3 py-2 rounded border">
              {generatedCode}
            </code>

            <motion.button
              onClick={copyToClipboard}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            </motion.button>
          </div>
        </motion.div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-gray-700">Your Coupons ({existingCoupons.length})</p>
          {isLoading && <RefreshCw className="w-4 h-4 animate-spin text-gray-400" />}
        </div>

        <div className="space-y-2 max-h-48 overflow-y-auto">
          {existingCoupons.length === 0 ? (
            <p className="text-xs text-gray-500 text-center py-4">No coupons created yet</p>
          ) : (
            existingCoupons.map((coupon) => (
              <div key={coupon.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <code className="text-sm font-mono font-bold text-blue-600">{coupon.code}</code>
                  <span className="text-xs text-gray-500">{coupon.discount}% off</span>
                </div>
                <button
                  onClick={() => deleteCoupon(coupon.id)}
                  className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Delete coupon"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CouponGenerator;
