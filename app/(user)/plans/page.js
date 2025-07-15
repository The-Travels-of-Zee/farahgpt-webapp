"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Star, Loader2, AlertCircle } from "lucide-react";
import useUserStore from "@/store/userStore";
import HydrationWrapper from "@/components/HydrationWrapper";
import {
  updateSubscription,
  getSubscriptionStatus,
  restoreSubscription,
  cancelSubscription,
} from "@/lib/actions/subscriptionActions";

const SubscriptionPageContent = () => {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const modalRef = useRef(null);

  const { user, isPremium, subscriptionTier, setPremium, setSubscriptionTier } = useUserStore();

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setShowUpgradeModal(false);
      }
    };
    if (showUpgradeModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUpgradeModal]);

  // Load current subscription status
  useEffect(() => {
    if (user?.id) {
      loadSubscriptionStatus();
    }
  }, [user?.id]);

  const loadSubscriptionStatus = async () => {
    try {
      const result = await getSubscriptionStatus(user.id);
      if (result.success) {
        setSubscriptionTier(result.data.subscription_tier || "free");
        console.log("Current subscription tier:", result.data.subscription_tier);
      }
    } catch (error) {
      console.error("Error loading subscription status:", error);
    }
  };

  const handleUpgrade = async () => {
    if (!user?.id) {
      setError("Please log in to upgrade your subscription");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const result = await updateSubscription(user.id, "premium");

      if (result.success) {
        setSuccess("Successfully upgraded to Premium!");
        setShowUpgradeModal(false);
        // Reload subscription status to update UI
        await loadSubscriptionStatus();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.error || "Failed to upgrade subscription");
      }
    } catch (error) {
      setError("An error occurred during upgrade. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async () => {
    if (!user?.id) {
      setError("Please log in to restore purchases");
      return;
    }

    setIsRestoring(true);
    setError(null);

    try {
      const result = await restoreSubscription(user.id);

      if (result.success) {
        setSuccess(result.message || "Subscription restored successfully!");
        // Reload subscription status to update UI
        await loadSubscriptionStatus();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.message || "No active subscription found to restore");
      }
    } catch (error) {
      setError("Failed to restore subscription. Please try again.");
    } finally {
      setIsRestoring(false);
    }
  };

  const handleCancel = async () => {
    if (!user?.id) {
      setError("Please log in to cancel subscription");
      return;
    }

    setIsCanceling(true);
    setError(null);

    try {
      const result = await cancelSubscription(user.id);

      if (result.success) {
        setSuccess("Subscription canceled successfully!");
        // Reload subscription status to update UI
        await loadSubscriptionStatus();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.error || "Failed to cancel subscription");
      }
    } catch (error) {
      setError("Failed to cancel subscription. Please try again.");
    } finally {
      setIsCanceling(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2,
      },
    },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Success/Error Messages */}
      <AnimatePresence>
        {(success || error) && (
          <motion.div
            className="fixed top-4 right-4 z-50 max-w-sm"
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
          >
            <div
              className={`p-4 rounded-xl shadow-lg ${
                success
                  ? "bg-green-100 border border-green-200 text-green-800"
                  : "bg-red-100 border border-red-200 text-red-800"
              }`}
            >
              <div className="flex items-center space-x-2">
                {success ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                )}
                <span className="font-medium">{success || error}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.main
        className="max-w-md mx-auto p-6 space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Title Section */}
        <motion.div variants={itemVariants} className="text-center space-y-2">
          <h2 className="text-3xl font-bold font-arefruqaa text-teal-700">Choose Your Plan</h2>
          <p className="text-slate-600 text-lg">Unlock premium features for a better experience</p>
          {isPremium && (
            <motion.div
              className="inline-block bg-gradient-to-r from-teal-500 to-teal-600 text-white px-4 py-2 rounded-full text-sm font-medium"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              ✨ Premium Active
            </motion.div>
          )}
        </motion.div>

        {/* Free Tier */}
        <motion.div
          variants={itemVariants}
          className={`bg-white rounded-2xl p-6 shadow-lg border transition-all duration-300 ${
            subscriptionTier === "free" ? "border-teal-200 ring-2 ring-teal-100" : "border-slate-200 hover:shadow-xl"
          }`}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-2xl font-bold font-arefruqaa text-slate-800">Free Tier</h3>
              <p className="text-slate-600 mt-1">Basic access to Islamic Q&A</p>
            </div>
            <motion.span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                subscriptionTier === "free" ? "bg-teal-100 text-teal-700" : "bg-slate-100 text-slate-600"
              }`}
              whileHover={{ scale: 1.05 }}
            >
              {subscriptionTier === "free" ? "Current" : "Free"}
            </motion.span>
          </div>

          <div className="space-y-3">
            <motion.div className="flex items-center space-x-3" whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
              <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-teal-600" />
              </div>
              <span className="text-slate-700">10 queries per day</span>
            </motion.div>

            <motion.div className="flex items-center space-x-3" whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
              <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-teal-600" />
              </div>
              <span className="text-slate-700">General Islamic Q&A</span>
            </motion.div>

            <motion.div className="flex items-center space-x-3" whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
              <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-teal-600" />
              </div>
              <span className="text-slate-700">Limited chat history (10 messages)</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Premium Tier */}
        <motion.div
          variants={itemVariants}
          className={`relative bg-gradient-to-br from-white to-teal-50 rounded-2xl p-6 shadow-xl border-2 transition-all duration-300 ${
            subscriptionTier === "premium" ? "border-teal-400 ring-2 ring-teal-200" : "border-teal-200 hover:shadow-2xl"
          }`}
        >
          <motion.div
            className="absolute -top-3 right-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg"
            animate={{ y: [0, -2, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            {subscriptionTier === "premium" ? "Active" : "Best Value"}
          </motion.div>

          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-2xl font-bold font-arefruqaa text-slate-800">Premium Tier</h3>
              <p className="text-slate-600 mt-1">Unlimited access and exclusive features</p>
            </div>
            <motion.span
              className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-4 py-2 rounded-full text-lg font-bold shadow-lg"
              whileHover={{ scale: 1.05 }}
            >
              $9.99/month
            </motion.span>
          </div>

          <div className="space-y-3">
            <motion.div className="flex items-center space-x-3" whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
              <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className="text-slate-700 font-medium">Unlimited queries</span>
            </motion.div>

            <motion.div className="flex items-center space-x-3" whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
              <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className="text-slate-700 font-medium">Pin courses to chats</span>
            </motion.div>

            <motion.div className="flex items-center space-x-3" whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
              <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className="text-slate-700 font-medium">Priority responses</span>
            </motion.div>

            <motion.div className="flex items-center space-x-3" whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
              <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className="text-slate-700 font-medium">Full chat history access</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div variants={itemVariants} className="space-y-3">
          {subscriptionTier === "free" ? (
            <motion.button
              onClick={() => setShowUpgradeModal(true)}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                "Upgrade to Premium"
              )}
            </motion.button>
          ) : (
            <motion.button
              onClick={handleCancel}
              disabled={isCanceling}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {isCanceling ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Canceling...</span>
                </div>
              ) : (
                "Cancel Subscription"
              )}
            </motion.button>
          )}

          <motion.button
            onClick={handleRestore}
            disabled={isRestoring}
            className="w-full bg-slate-100 text-slate-700 py-4 rounded-2xl font-semibold hover:bg-slate-200 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isRestoring ? (
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Restoring...</span>
              </div>
            ) : (
              "Restore Purchases"
            )}
          </motion.button>
        </motion.div>
      </motion.main>

      {/* Upgrade Modal */}
      <AnimatePresence>
        {showUpgradeModal && (
          <div>
            <motion.div
              className="fixed inset-0 bg-black/50 bg-opacity-20 backdrop-blur-sm z-40"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => setShowUpgradeModal(false)}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl" ref={modalRef}>
                <div className="text-center space-y-6">
                  <motion.div
                    className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto shadow-lg"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                  >
                    <Star className="w-8 h-8 text-white" />
                  </motion.div>

                  <div>
                    <h3 className="text-2xl font-bold text-teal-700 mb-2">Upgrade to Premium</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Unlock unlimited queries, file uploads, full chat history, and priority responses for just
                      $9.99/month!
                    </p>
                  </div>

                  <div className="text-sm text-slate-500">Proceed to purchase via RevenueCat.</div>

                  <div className="flex space-x-3">
                    <motion.button
                      onClick={() => setShowUpgradeModal(false)}
                      disabled={isLoading}
                      className="flex-1 py-3 text-slate-600 font-semibold hover:text-slate-800 transition-colors disabled:opacity-50"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      onClick={handleUpgrade}
                      disabled={isLoading}
                      className="flex-1 bg-gradient-to-r from-teal-600 to-teal-700 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Processing...</span>
                        </div>
                      ) : (
                        "Confirm"
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SubscriptionPage = () => {
  return (
    <HydrationWrapper>
      <SubscriptionPageContent />
    </HydrationWrapper>
  );
};

export default SubscriptionPage;
