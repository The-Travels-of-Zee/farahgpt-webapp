"use server";

import useUserStore from "@/store/userStore";
import supabase from "../supabase/supabase";

// Get Zustand store actions
const { login, logout, user, setUser, setRole, setPremium, setEnrolledCourses } = useUserStore.getState();

// Server action to fetch all courses
export async function fetchUsers() {
  try {
    let query = supabase.from("users").select("*");

    // If you want to filter by user and maintain RLS, use this instead:
    // let query = supabase.from("courses").select("*");
    // if (userId) {
    //   query = query.eq('user_id', userId); // Adjust field name as needed
    // }

    const { data, error } = await query;

    console.log("Fetched Users:", data);

    if (error) {
      console.error("Supabase error:", error);
      throw new Error(`Failed to fetch users: ${error.message}`);
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error("Fetch users error:", error);
    return { success: false, error: error.message, data: [] };
  }
}

export const updateSubscription = async (userId, subscriptionTier) => {
  try {
    // Update subscription tier in database
    const { data, error } = await supabase
      .from("users")
      .update({ subscription_tier: subscriptionTier })
      .eq("id", userId)
      .select();

    if (error) {
      console.error("Supabase error:", error);
      throw new Error(`Failed to update subscription: ${error.message}`);
    }

    console.log("Subscription updated:", data);
    
    // Update local state
    const isPremium = subscriptionTier === 'premium';
    setPremium(isPremium);
    
    return { success: true, data: data[0] };
  } catch (error) {
    console.error("Update subscription error:", error);
    return { success: false, error: error.message };
  }
};

export const getSubscriptionStatus = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("subscription_tier, id, email")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Supabase error:", error);
      throw new Error(`Failed to fetch user: ${error.message}`);
    }

    console.log("User subscription data:", data);
    
    // Update local state based on subscription tier
    const isPremium = data.subscription_tier === 'premium';
    setPremium(isPremium);
    
    return { 
      success: true, 
      data: {
        ...data,
        isPremium
      }
    };
  } catch (error) {
    console.error("Fetch subscription error:", error);
    return { success: false, error: error.message, data: null };
  }
};

export const cancelSubscription = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .update({ subscription_tier: 'free' })
      .eq("id", userId)
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
    
    if (result.success && result.data.subscription_tier === 'premium') {
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
