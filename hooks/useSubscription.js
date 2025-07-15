// hooks/useSubscription.js
import { useState, useEffect, useCallback } from "react";
import useUserStore from "@/store/userStore";
import { getSubscriptionStatus, updateSubscription, cancelSubscription } from "@/lib/actions/subscriptionActions";

export const useSubscription = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    user,
    isPremium,
    subscriptionTier,
    setPremium,
    setSubscriptionTier,
    hasFeature,
    getQueryLimit,
    getChatHistoryLimit,
  } = useUserStore();

  // Load subscription status on mount
  useEffect(() => {
    if (user.id) {
      loadSubscriptionStatus();
    }
  }, [user.id]);

  const loadSubscriptionStatus = useCallback(async () => {
    if (!user.id) return;

    // Debug: Log the user object
    console.log("👤 Current user from store:", user);
    console.log("🆔 User ID:", user.id, "Type:", typeof user.id);

    setIsLoading(true);
    setError(null);

    try {
      const result = await getSubscriptionStatus(user.id);

      if (result.success) {
        const { subscription } = result;

        // Update subscription tier in store
        setSubscriptionTier(subscription.tier || "free");

        // Update premium status based on tier
        const isPremiumTier = subscription.tier === "premium" || subscription.tier === "pro";
        setPremium(isPremiumTier);

        // Log subscription details for debugging
        console.log("✅ Subscription loaded:", {
          tier: subscription.tier,
          status: subscription.status,
          isPremium: isPremiumTier,
          expiresAt: subscription.expiresAt,
        });

        // Handle subscription expiration
        if (subscription.expiresAt) {
          const expiryDate = new Date(subscription.expiresAt);
          const now = new Date();

          if (expiryDate <= now && subscription.status === "active") {
            console.log("⚠️ Subscription expired, updating to free tier");
            setSubscriptionTier("free");
            setPremium(false);
          }
        }

        // Handle cancelled or inactive subscriptions
        if (subscription.status === "cancelled" || subscription.status === "inactive") {
          console.log("⚠️ Subscription inactive, updating to free tier");
          setSubscriptionTier("free");
          setPremium(false);
        }
      } else {
        console.error("❌ Failed to load subscription:", result.error);
        setError(result.error || "Failed to load subscription status");

        // Fallback to free tier if subscription loading fails
        setSubscriptionTier("free");
        setPremium(false);
      }
    } catch (err) {
      console.error("❌ Subscription loading error:", err);
      setError("Failed to load subscription status");

      // Fallback to free tier on error
      setSubscriptionTier("free");
      setPremium(false);
    } finally {
      setIsLoading(false);
    }
  }, [user.id, setSubscriptionTier, setPremium]);

  const upgrade = useCallback(
    async (targetTier = "premium") => {
      if (!user.id) {
        setError("Please log in to upgrade");
        return { success: false, error: "Not logged in" };
      }

      // Validate target tier
      const validTiers = ["premium", "pro"];
      if (!validTiers.includes(targetTier)) {
        setError("Invalid subscription tier");
        return { success: false, error: "Invalid subscription tier" };
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await updateSubscription(user.id, targetTier);

        if (result.success) {
          setSubscriptionTier(targetTier);
          setPremium(true);

          console.log(`✅ Successfully upgraded to ${targetTier}`);
          return { success: true, tier: targetTier };
        } else {
          console.error("❌ Upgrade failed:", result.error);
          setError(result.error);
          return { success: false, error: result.error };
        }
      } catch (err) {
        console.error("❌ Upgrade error:", err);
        const errorMsg = "Failed to upgrade subscription";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setIsLoading(false);
      }
    },
    [user.id, setSubscriptionTier, setPremium]
  );

  const cancel = useCallback(async () => {
    if (!user.id) {
      setError("Please log in to cancel");
      return { success: false, error: "Not logged in" };
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await cancelSubscription(user.id);

      if (result.success) {
        setSubscriptionTier("free");
        setPremium(false);

        console.log("✅ Successfully cancelled subscription");
        return { success: true };
      } else {
        console.error("❌ Cancellation failed:", result.error);
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      console.error("❌ Cancellation error:", err);
      const errorMsg = "Failed to cancel subscription";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, [user.id, setSubscriptionTier, setPremium]);

  const checkFeatureAccess = useCallback(
    (feature) => {
      const hasAccess = hasFeature(feature);
      console.log(`🔍 Feature access check for "${feature}":`, hasAccess);
      return hasAccess;
    },
    [hasFeature]
  );

  const checkQueryLimit = useCallback(
    (currentUsage = 0) => {
      const limit = getQueryLimit();
      if (limit === -1) {
        console.log("🔄 Query limit check: Unlimited");
        return { hasAccess: true, remaining: -1 }; // Unlimited
      }

      const hasAccess = currentUsage < limit;
      const remaining = Math.max(0, limit - currentUsage);

      console.log(`🔄 Query limit check: ${currentUsage}/${limit}, remaining: ${remaining}`);
      return { hasAccess, remaining };
    },
    [getQueryLimit]
  );

  const checkChatHistoryLimit = useCallback(
    (currentCount = 0) => {
      const limit = getChatHistoryLimit();
      if (limit === -1) {
        console.log("💬 Chat history limit check: Unlimited");
        return { hasAccess: true, remaining: -1 }; // Unlimited
      }

      const hasAccess = currentCount < limit;
      const remaining = Math.max(0, limit - currentCount);

      console.log(`💬 Chat history limit check: ${currentCount}/${limit}, remaining: ${remaining}`);
      return { hasAccess, remaining };
    },
    [getChatHistoryLimit]
  );

  const refreshSubscription = useCallback(async () => {
    console.log("🔄 Refreshing subscription status...");
    await loadSubscriptionStatus();
  }, [loadSubscriptionStatus]);

  const getSubscriptionInfo = useCallback(() => {
    return {
      tier: subscriptionTier,
      isPremium,
      user: user.id,
      queryLimit: getQueryLimit(),
      chatHistoryLimit: getChatHistoryLimit(),
    };
  }, [subscriptionTier, isPremium, user.id, getQueryLimit, getChatHistoryLimit]);

  return {
    // State
    isLoading,
    error,
    isPremium,
    subscriptionTier,

    // Actions
    loadSubscriptionStatus,
    upgrade,
    cancel,
    refreshSubscription,

    // Feature checks
    checkFeatureAccess,
    checkQueryLimit,
    checkChatHistoryLimit,

    // Utility methods
    clearError: () => setError(null),
    getSubscriptionInfo,
  };
};

export default useSubscription;
