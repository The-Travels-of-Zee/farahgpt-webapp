"use server";

import useUserStore from "@/store/userStore";

import { createClient } from "@/lib/supabase/server";

// Get Zustand store actions
const { setPremium } = useUserStore.getState();

export const updateSubscription = async () => {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!user || userError) {
      throw new Error("Authentication required");
    }

    // Update subscription tier in database
    const { data, error } = await supabase
      .from("users")
      .update({ subscription_tier: "premium" })
      .eq("id", user.id)
      .select();

    if (error) {
      console.error("Supabase error:", error);
      throw new Error(`Failed to update subscription: ${error.message}`);
    }

    console.log("Subscription updated:", data);

    // Update local state
    const isPremium = user.subscription_tier === "premium";
    setPremium(isPremium);

    return { success: true, data: data[0] };
  } catch (error) {
    console.error("Update subscription error:", error);
    return { success: false, error: error.message };
  }
};

export const getSubscriptionStatus = async () => {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!user || userError) {
      throw new Error("Authentication required");
    }
    const { data, error } = await supabase
      .from("users")
      .select("id, email, subscription_tier")
      .eq("id", user.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        console.log("User not found in users table, creating default...");
        return {
          success: true,
          data: {
            id: user.id,
            subscription_tier: "free",
            isPremium: false,
          },
        };
      }
      console.error("Supabase error:", error);
      throw new Error(`Failed to fetch user: ${error.message}`);
    }

    console.log("User subscription data:", data);

    // Update local state based on subscription tier
    const isPremium = data.subscription_tier === "premium";
    setPremium(isPremium);

    return {
      success: true,
      data: {
        ...data,
        isPremium,
      },
    };
  } catch (error) {
    console.error("Fetch subscription error:", error);
    return { success: false, error: error.message, data: null };
  }
};

export const cancelSubscription = async () => {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!user || userError) {
      throw new Error("Authentication required");
    }
    const { data, error } = await supabase
      .from("users")
      .update({ subscription_tier: "free" })
      .eq("id", user.id)
      .select();

    if (error) {
      console.error("Supabase error:", error);
      throw new Error(`Failed to cancel subscription: ${error.message}`);
    }

    console.log("Subscription cancelled:", data);

    // Update local state
    setPremium(false);

    return { success: true, data: data[0] };
  } catch (error) {
    console.error("Cancel subscription error:", error);
    return { success: false, error: error.message };
  }
};

export const restoreSubscription = async (userId) => {
  try {
    // This would typically integrate with your payment provider (RevenueCat, Stripe, etc.)
    // For now, we'll just check the current status
    const result = await getSubscriptionStatus(userId);

    if (result.success && result.data.subscription_tier === "premium") {
      setPremium(true);
      return { success: true, message: "Premium subscription restored!" };
    } else {
      return { success: false, message: "No active premium subscription found" };
    }
  } catch (error) {
    console.error("Restore subscription error:", error);
    return { success: false, error: error.message };
  }
};
