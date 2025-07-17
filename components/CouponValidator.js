// components/CouponValidator.js
"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Percent, Tag } from "lucide-react";
import { validateCouponCode } from "../actions/couponActions";

const CouponValidator = ({ onCouponApplied, currentTotal = 0 }) => {
  const [couponCode, setCouponCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [validCoupon, setValidCoupon] = useState(null);
  const [error, setError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const validateCoupon = async () => {
    if (!couponCode.trim()) {
      setError("Please enter a coupon code");
      return;
    }

    setIsValidating(true);
    setError("");

    try {
      const result = await validateCouponCode(couponCode.trim());
      
      if (result.success) {
        setValidCoupon(result.data);
        setError("");
      } else {
        setError(result.error || "Invalid coupon code");
        setValidCoupon(null);
      }
    } catch (err) {
      setError("Failed to validate coupon code");
      setValidCoupon(null);
    } finally {
      setIsValidating(false);
    }
  };

  const applyCoupon = () => {
    if (!validCoupon) return;

    const discountAmount = (currentTotal * validCoupon.discount) / 100;
    const newTotal = currentTotal - discountAmount;

    setAppliedCoupon({
      ...validCoupon,
      discountAmount,
      newTotal,
    });

    // Call parent component callback
    if (onCouponApplied) {
      onCouponApplied({
        coupon: validCoupon,
        discountAmount,
        newTotal,
      });
    }

    // Clear the input
    setCouponCode("");
    setValidCoupon(null);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    if (onCouponApplied) {
      onCouponApplied(null);
    }
  };

  const handleInputChange = (e) => {
    setCouponCode(e.target.value.toUpperCase());
    setError("");
    setValidCoupon(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      validateCoupon();
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Tag className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-800">Coupon Code</h3>
      </div>

      {!appliedCoupon ? (
        <div className="space-y-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={couponCode}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Enter coupon code"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors font-mono"
              disabled={isValidating}
            />
            <button
              onClick={validateCoupon}
              disabled={isValidating || !couponCode.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isValidating ? "Checking..." : "Apply"}
            </button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-2 text-red-600 text-sm"
            >
              <X className="w-4 h-4" />
              <span>{error}</span>
            </motion.div>
          )}

          {validCoupon && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 border border-green-200 rounded-lg p-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-green-800 font-medium">
                    Valid coupon! {validCoupon.discount}% off
                  </span>
                </div>
                <button
                  onClick={applyCoupon}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                >
                  Apply
                </button>
              </div>
              
              {validCoupon.sellers && (
                <p className="text-green-700 text-xs mt-1">
                  By: {validCoupon.sellers.name}
                </p>
              )}
              
              <div className="mt-2 text-sm text-green-700">
                <p>Discount: ${((currentTotal * validCoupon.discount) / 100).toFixed(2)}</p>
                <p className="font-medium">
                  New Total: ${(currentTotal - (currentTotal * validCoupon.discount) / 100).toFixed(2)}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Percent className="w-4 h-4 text-blue-600" />
              <span className="text-blue-800 font-medium">
                Coupon Applied: {appliedCoupon.code}
              </span>
            </div>
            <button
              onClick={removeCoupon}
              className="text-red-600 hover:text-red-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="mt-2 text-sm text-blue-700">
            <p>Discount ({appliedCoupon.discount}%): -${appliedCoupon.discountAmount.toFixed(2)}</p>
            <p className="font-medium">Total: ${appliedCoupon.newTotal.toFixed(2)}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CouponValidator;