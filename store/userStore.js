// store/userStore.js
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useUserStore = create(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      user: null,
      role: null, // 'user' | 'instructor' | 'admin'
      avatar: null,
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
          isPremium: user.subscription_tier === "premium",
          subscriptionTier: user.subscription_tier || "free",
        }),

      logout: () =>
        set({
          user: null,
          isLoggedIn: false,
          role: null,
          avatar: null,
          isPremium: false,
          subscriptionTier: "free",
        }),

      setUser: (user) =>
        set({
          user,
          isPremium: user.subscription_tier === "premium",
          subscriptionTier: user.subscription_tier || "free",
        }),

      setRole: (role) => set({ role }),

      setPremium: (value) =>
        set({
          isPremium: value,
          subscriptionTier: value ? "premium" : "free",
        }),

      setSubscriptionTier: (tier) =>
        set({
          subscriptionTier: tier,
          isPremium: tier === "premium",
        }),

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
