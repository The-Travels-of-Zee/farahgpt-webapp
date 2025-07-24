"use server";

import useUserStore from "@/store/userStore";
import { createClient } from "@/lib/supabase/server";

export async function fetchUsers() {
  try {
    const supabase = await createClient();
    // Get current authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("Authentication required");
    }

    // Fetch users
    const { data, error } = await supabase.from("users").select("*");

    if (error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }

    return { success: true, data };
  } catch (error) {
    console.error("Fetch users error:", error);
    return { success: false, error: error.message, data: [] };
  }
}

// Update user profile information
export async function updateUserProfile(userId, profileData) {
  try {
    const supabase = await createClient();
    // Verify session on server
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (!session) {
      throw new Error("No active session found");
    }

    if (!userId) {
      throw new Error("User ID is required");
    }

    // Prepare the update data
    const updateData = {
      name: profileData.fullName,
      email: profileData.email,
      updated_at: new Date().toISOString(),
    };

    // Remove undefined values
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined || updateData[key] === null) {
        delete updateData[key];
      }
    });

    const { data, error } = await supabase.from("users").update(updateData).eq("id", userId).select().single();

    if (error) {
      console.error("Supabase update error:", error);
      throw new Error(`Failed to update profile: ${error.message}`);
    }

    console.log("Profile updated successfully:", data);

    return { success: true, data };
  } catch (error) {
    console.error("Update profile error:", error);
    return { success: false, error: error.message };
  }
}

export async function uploadProfilePicture(userId, imageFile) {
  try {
    const supabase = await createClient();
    if (!userId) {
      throw new Error("User ID is required");
    }

    if (!imageFile) {
      throw new Error("Image file is required");
    }

    // Get the current user's auth ID from Supabase
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error("User not authenticated");
    }

    // Generate filename using the authenticated user's ID
    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${user.id}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    console.log("Uploading file:", filePath, "for user:", user.id);

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("profile-pictures")
      .upload(filePath, imageFile, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw new Error(`Failed to upload image: ${uploadError.message}`);
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("profile-pictures").getPublicUrl(filePath);

    console.log("Generated public URL:", publicUrl);

    // Update user's profile_picture_url in database
    const { data: userData, error: updateError } = await supabase
      .from("users")
      .update({
        photo_url: publicUrl, // Using consistent field name
        // updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()
      .single();

    if (updateError) {
      console.error("Database update error:", updateError);
      throw new Error(`Failed to update profile picture URL: ${updateError.message}`);
    }

    console.log("Profile picture uploaded successfully:", publicUrl);

    // Update the Zustand store with the new user data - get fresh actions
    const { setUser } = useUserStore.getState();
    setUser(userData);

    return { success: true, data: userData, imageUrl: publicUrl };
  } catch (error) {
    console.error("Upload profile picture error:", error);
    return { success: false, error: error.message };
  }
}

// Alternative version if you want to use the passed userId directly
export async function uploadProfilePictureAlt(userId, imageFile) {
  try {
    const supabase = await createClient();
    if (!userId) {
      throw new Error("User ID is required");
    }

    if (!imageFile) {
      throw new Error("Image file is required");
    }

    // Generate filename using the provided userId
    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${userId}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    console.log("Uploading file:", filePath, "for user:", userId);

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("profile-pictures")
      .upload(filePath, imageFile, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw new Error(`Failed to upload image: ${uploadError.message}`);
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("profile-pictures").getPublicUrl(filePath);

    console.log("Generated public URL:", publicUrl);

    // Update user's profile_picture_url in database
    const { data: userData, error: updateError } = await supabase
      .from("users")
      .update({
        photo_url: publicUrl, // Using consistent field name
        // updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()
      .single();

    if (updateError) {
      console.error("Database update error:", updateError);
      throw new Error(`Failed to update profile picture URL: ${updateError.message}`);
    }

    console.log("Profile picture uploaded successfully:", publicUrl);

    // Update the Zustand store with the new user data - get fresh actions
    const { setUser } = useUserStore.getState();
    setUser(userData);

    return { success: true, data: userData, imageUrl: publicUrl };
  } catch (error) {
    console.error("Upload profile picture error:", error);
    return { success: false, error: error.message };
  }
}

// Get user profile by ID
export async function getUserProfile(userId) {
  try {
    const supabase = await createClient();
    if (!userId) {
      throw new Error("User ID is required");
    }

    const { data, error } = await supabase.from("users").select("*").eq("id", userId).single();

    if (error) {
      console.error("Supabase error:", error);
      throw new Error(`Failed to fetch user profile: ${error.message}`);
    }

    // Update store when getting user profile - get fresh actions
    const { setUser } = useUserStore.getState();
    setUser(data);

    return { success: true, data };
  } catch (error) {
    console.error("Get user profile error:", error);
    return { success: false, error: error.message };
  }
}

// Delete profile picture
export async function deleteProfilePicture(userId) {
  try {
    const supabase = await createClient();
    if (!userId) {
      throw new Error("User ID is required");
    }

    // Get current profile picture URL
    const { data: userData, error: getUserError } = await supabase
      .from("users")
      .select("photo_url")
      .eq("id", userId)
      .single();

    if (getUserError) {
      throw new Error(`Failed to get user data: ${getUserError.message}`);
    }

    // Extract filename from URL if exists
    if (userData.photo_url) {
      try {
        const url = new URL(userData.photo_url);
        const pathParts = url.pathname.split("/");
        const filename = pathParts[pathParts.length - 1];

        // Delete from storage
        const { error: deleteError } = await supabase.storage.from("profile-pictures").remove([filename]);

        if (deleteError) {
          console.error("Storage delete error:", deleteError);
          // Continue even if storage deletion fails
        }
      } catch (urlError) {
        console.error("Error parsing URL:", urlError);
        // Continue even if URL parsing fails
      }
    }

    // Update database to remove profile picture URL
    const { data, error } = await supabase
      .from("users")
      .update({
        photo_url: null,
        // updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      console.error("Database update error:", error);
      throw new Error(`Failed to update profile: ${error.message}`);
    }

    // Update the Zustand store with the new user data - get fresh actions
    const { setUser } = useUserStore.getState();
    setUser(data);

    return { success: true, data };
  } catch (error) {
    console.error("Delete profile picture error:", error);
    return { success: false, error: error.message };
  }
}

// Batch update user settings
export async function updateUserSettings(userId, settings) {
  try {
    const supabase = await createClient();
    if (!userId) {
      throw new Error("User ID is required");
    }

    const updateData = {
      ...settings,
      // updated_at: new Date().toISOString(),
    };

    // Remove undefined values
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined || updateData[key] === null) {
        delete updateData[key];
      }
    });

    const { data, error } = await supabase.from("users").update(updateData).eq("id", userId).select().single();

    if (error) {
      console.error("Supabase update error:", error);
      throw new Error(`Failed to update settings: ${error.message}`);
    }

    // Update the Zustand store with the new user data - get fresh actions
    const { setUser } = useUserStore.getState();
    setUser(data);

    return { success: true, data };
  } catch (error) {
    console.error("Update settings error:", error);
    return { success: false, error: error.message };
  }
}

export const updateSubscription = async (userId, subscriptionTier) => {
  try {
    const supabase = await createClient();
    // Update subscription tier in database
    const { data, error } = await supabase
      .from("users")
      .update({
        subscription_tier: subscriptionTier,
        // updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      throw new Error(`Failed to update subscription: ${error.message}`);
    }

    console.log("Subscription updated:", data);

    // Update local state - get fresh actions
    const { setPremium, setUser, setSubscriptionTier } = useUserStore.getState();
    const isPremium = subscriptionTier === "premium";

    setPremium(isPremium);
    setSubscriptionTier(subscriptionTier);
    setUser(data);

    return { success: true, data };
  } catch (error) {
    console.error("Update subscription error:", error);
    return { success: false, error: error.message };
  }
};

export const getSubscriptionStatus = async (userId) => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("users").select("*").eq("id", userId).single();

    if (error) {
      console.error("Supabase error:", error);
      throw new Error(`Failed to fetch user: ${error.message}`);
    }

    console.log("User subscription data:", data);

    // Update local state based on subscription tier - get fresh actions
    const { setPremium, setUser, setSubscriptionTier } = useUserStore.getState();
    const isPremium = data.subscription_tier === "premium";

    setPremium(isPremium);
    setSubscriptionTier(data.subscription_tier || "free");
    setUser(data);

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

export const cancelSubscription = async (userId) => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("users")
      .update({
        subscription_tier: "free",
        // updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      throw new Error(`Failed to cancel subscription: ${error.message}`);
    }

    console.log("Subscription cancelled:", data);

    // Update local state - get fresh actions
    const { setPremium, setUser, setSubscriptionTier } = useUserStore.getState();

    setPremium(false);
    setSubscriptionTier("free");
    setUser(data);

    return { success: true, data };
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
      const { setPremium, setUser, setSubscriptionTier } = useUserStore.getState();
      setPremium(true);
      setSubscriptionTier("premium");
      setUser(result.data);
      return { success: true, message: "Premium subscription restored!" };
    } else {
      return { success: false, message: "No active premium subscription found" };
    }
  } catch (error) {
    console.error("Restore subscription error:", error);
    return { success: false, error: error.message };
  }
};

// Helper function to refresh user data in store after any profile update
export async function refreshUserInStore(userId) {
  try {
    const result = await getUserProfile(userId);
    if (result.success) {
      // getUserProfile already updates the store
      return result;
    }
    return result;
  } catch (error) {
    console.error("Refresh user in store error:", error);
    return { success: false, error: error.message };
  }
}
