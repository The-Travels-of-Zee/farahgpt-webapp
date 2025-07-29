// hooks/useUser.js
import { useEffect } from "react";
import useUserStore from "@/store/userStore";

export const useUser = () => {
  const store = useUserStore();

  // Helper function to refresh user data
  const refreshUser = async (userId) => {
    if (!userId) return { success: false, error: "User ID is required" };

    try {
      // Import the server action dynamically
      const { getUserProfile } = await import("@/lib/actions/userActions");
      const result = await getUserProfile(userId);

      if (result.success) {
        // Force update the store with fresh data
        const { setUser } = useUserStore.getState();
        setUser(result.data);
        console.log("User data refreshed successfully", result.data);
        return result;
      } else {
        console.error("Failed to refresh user data:", result.error);
        return result;
      }
    } catch (error) {
      console.error("Failed to refresh user data:", error);
      return { success: false, error: error.message };
    }
  };

  // Helper function to update profile
  const updateProfile = async (userId, profileData) => {
    try {
      const { updateUserProfile } = await import("@/lib/actions/userActions");
      const result = await updateUserProfile(userId, profileData);

      if (result.success) {
        // The server action already updates the store, but let's ensure it's fresh
        await refreshUser(userId);
        console.log("Profile updated successfully");
        return result;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      throw error;
    }
  };

  // Helper function to upload profile picture
  const uploadProfilePicture = async (userId, imageFile) => {
    try {
      const { uploadProfilePicture: uploadAction } = await import("@/lib/actions/userActions");
      const result = await uploadAction(userId, imageFile);

      if (result.success) {
        // Ensure fresh data after upload
        await refreshUser(userId);
        console.log("Profile picture uploaded successfully");
        return result;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Failed to upload profile picture:", error);
      throw error;
    }
  };

  // Helper function to delete profile picture
  const deleteProfilePicture = async (userId) => {
    try {
      const { deleteProfilePicture: deleteAction } = await import("@/lib/actions/userActions");
      const result = await deleteAction(userId);

      if (result.success) {
        // Ensure fresh data after deletion
        await refreshUser(userId);
        console.log("Profile picture deleted successfully");
        return result;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Failed to delete profile picture:", error);
      throw error;
    }
  };

  return {
    // Store state
    ...store,

    // Helper functions
    refreshUser,
    updateProfile,
    uploadProfilePicture,
    deleteProfilePicture,

    // Computed values
    displayName: store.getUserDisplayName(),
    photoUrl: store.getUserPhotoUrl(),
    currentUser: store.getCurrentUser(),
    // hasFeature: store.hasFeature,
    getQueryLimit: store.getQueryLimit(),
    getChatHistoryLimit: store.getChatHistoryLimit(),
  };
};

export default useUser;
