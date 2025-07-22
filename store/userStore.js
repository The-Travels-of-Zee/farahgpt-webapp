// store/userStore.js
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useUserStore = create(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      user: null,
      role: null, // 'user' | 'instructor' | 'admin'
      photo_url: null,
      isPremium: false,
      subscriptionTier: "free", // 'free' | 'premium'
      // Add hydration state
      _hasHydrated: false,
      setHasHydrated: (state) => {
        set({
          _hasHydrated: state,
        });
      },

      // Actions
      login: (user) =>
        set({
          user,
          isLoggedIn: true,
          photo_url: user.photo_url || null,
          isPremium: user.subscription_tier === "premium",
          subscriptionTier: user.subscription_tier || "free",
        }),

      logout: () =>
        set({
          user: null,
          isLoggedIn: false,
          role: null,
          photo_url: null,
          isPremium: false,
          subscriptionTier: "free",
        }),

      setUser: (user) => {
        if (!user) return;

        set((state) => ({
          user: { ...state.user, ...user },
          photo_url: user.photo_url || null,
          isPremium: user.subscription_tier === "premium",
          subscriptionTier: user.subscription_tier || "free",
          // Keep login state if user was already logged in
          isLoggedIn: state.isLoggedIn || Boolean(user.id),
        }));
      },

      setRole: (role) => set({ role }),

      setPremium: (value) =>
        set((state) => ({
          isPremium: value,
          subscriptionTier: value ? "premium" : "free",
          user: state.user
            ? {
                ...state.user,
                subscription_tier: value ? "premium" : "free",
              }
            : null,
        })),

      setSubscriptionTier: (tier) =>
        set((state) => ({
          subscriptionTier: tier,
          isPremium: tier === "premium",
          user: state.user
            ? {
                ...state.user,
                subscription_tier: tier,
              }
            : null,
        })),

      // Helper methods
      hasFeature: (feature) => {
        const state = get();
        const features = {
          unlimited_queries: state.isPremium,
          pin_courses: state.isPremium,
          priority_responses: state.isPremium,
          full_chat_history: state.isPremium,
          file_uploads: state.isPremium,
        };
        return features[feature] || false;
      },

      getQueryLimit: () => {
        const state = get();
        return state.isPremium ? -1 : 10; // -1 for unlimited, 10 for free
      },

      getChatHistoryLimit: () => {
        const state = get();
        return state.isPremium ? -1 : 10; // -1 for unlimited, 10 for free
      },

      // Method to get current user data
      getCurrentUser: () => {
        const state = get();
        return state.user;
      },

      // Method to get user display name
      getUserDisplayName: () => {
        const state = get();
        return state.user?.name || state.user?.email || "User";
      },

      // Method to get user photo URL
      getUserPhotoUrl: () => {
        const state = get();
        return state.user?.photo_url || state.photo_url;
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => {
        // Check if we're in the browser
        if (typeof window !== "undefined") {
          return localStorage;
        }
        // Fallback for SSR
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
        role: state.role,
        photo_url: state.photo_url,
        isPremium: state.isPremium,
        subscriptionTier: state.subscriptionTier,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

export default useUserStore;
