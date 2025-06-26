"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Copy, RefreshCw, Check, Gift } from "lucide-react";
import { z } from "zod";

const CouponSchema = z.object({
  code: z.string().min(6, "Code must be at least 6 characters"),
  discount: z.number().min(1).max(100),
  type: z.enum(["percentage", "fixed"]),
});

const CouponGenerator = () => {
  const [generatedCode, setGeneratedCode] = useState("");
  const [couponName, setCouponName] = useState("");
  const [discount, setDiscount] = useState(10);
  const [discountType, setDiscountType] = useState("percentage");
  const [existingCoupons, setExistingCoupons] = useState(["SAVE20", "WELCOME10", "SUMMER25", "FIRST15"]);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const generateRandomCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const generateCoupon = async () => {
    setIsGenerating(true);
    setError("");

    try {
      let newCode;
      let attempts = 0;
      let maxAttempts = 50;

      do {
        if (couponName.length > 0) {
          newCode = couponName.toUpperCase().trim().replace(/\s+/g, "_");
        } else {
          newCode = generateRandomCode();
        }
        attempts++;
      } while (existingCoupons.includes(newCode) && attempts < maxAttempts);

      if (attempts >= maxAttempts) {
        throw new Error("Unable to generate unique coupon code. Please try again.");
      }

      // Validate with Zod
      const couponData = {
        code: newCode,
        discount,
        type: discountType,
      };

      CouponSchema.parse(couponData);

      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call
      setGeneratedCode(newCode);
      setExistingCoupons((prev) => [...prev, newCode]);
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

  const copyToClipboard = async () => {
    if (generatedCode) {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-secondary/20 rounded-full mb-3">
          <Gift className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold font-arefruqaa text-primary mb-2">Coupon Generator</h2>
        <p className="text-gray-600 text-sm">Create unique discount codes</p>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Coupon Code</label>
          <input
            type="text"
            value={couponName}
            onChange={(e) => setCouponName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary/50 focus:border-transparent outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Discount Value</label>
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
            min="1"
            max="100"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary/50 focus:border-transparent outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Discount Type</label>
          <select
            value={discountType}
            onChange={(e) => setDiscountType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary/50 focus:border-transparent outline-none transition-colors"
          >
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed Amount ($)</option>
          </select>
        </div>
      </div>

      <motion.button
        onClick={generateCoupon}
        disabled={isGenerating}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-gradient-to-r from-(--primary-light) to-secondary hover:from-secondary hover:to-primary/70 transition-colors disabled:bg-(--primary-light) text-white font-medium py-3 px-4 rounded-lg duration-300 flex items-center justify-center space-x-2"
      >
        {isGenerating ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Generating...</span>
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

      {generatedCode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-gray-50 rounded-lg border"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Generated Code</span>
            <span className="text-xs text-gray-500">
              {discount}
              {discountType === "percentage" ? "%" : "$"} off
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <code className="flex-1 text-lg font-mono font-bold text-primary bg-white px-3 py-2 rounded border">
              {generatedCode}
            </code>

            <motion.button
              onClick={copyToClipboard}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-gray-600 hover:text-muted hover:bg-(--primary-light)/50 rounded-lg transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4 text-primary" />}
            </motion.button>
          </div>
        </motion.div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 mb-2">Existing Coupons ({existingCoupons.length})</p>
        <div className="flex flex-wrap gap-1">
          {existingCoupons.slice(-5).map((code, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded font-mono">
              {code}
            </span>
          ))}
          {existingCoupons.length > 5 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
              +{existingCoupons.length - 5} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CouponGenerator;
