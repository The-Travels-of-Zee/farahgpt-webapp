// store/couponStore.js
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useCouponStore = create(
  persist(
    (set, get) => ({
      coupons: [],
      isLoading: false,
      error: null,
      lastFetch: null,

      // Add hydration state
      _hasHydrated: false,
      setHasHydrated: (state) => {
        set({
          _hasHydrated: state,
        });
      },

      // Actions
      setCoupons: (coupons) =>
        set({
          coupons,
          lastFetch: Date.now(),
          error: null,
        }),

      addCoupon: (coupon) =>
        set((state) => ({
          coupons: [coupon, ...state.coupons],
          error: null,
        })),

      removeCoupon: (couponId) =>
        set((state) => ({
          coupons: state.coupons.filter((coupon) => coupon.id !== couponId),
          error: null,
        })),

      updateCoupon: (couponId, updateData) =>
        set((state) => ({
          coupons: state.coupons.map((coupon) => (coupon.id === couponId ? { ...coupon, ...updateData } : coupon)),
          error: null,
        })),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      clearError: () => set({ error: null }),

      // Helper methods
      getCouponByCode: (code) => {
        const state = get();
        return state.coupons.find((coupon) => coupon.code === code.toUpperCase());
      },

      getCouponById: (id) => {
        const state = get();
        return state.coupons.find((coupon) => coupon.id === id);
      },

      getCouponCount: () => {
        const state = get();
        return state.coupons.length;
      },

      getActiveCoupons: () => {
        const state = get();
        // If you add expiration or status fields later, filter here
        return state.coupons.filter((coupon) => true); // Currently all are active
      },

      shouldRefetch: (maxAge = 5 * 60 * 1000) => {
        const state = get();
        return !state.lastFetch || Date.now() - state.lastFetch > maxAge;
      },

      // Clear all data (useful for logout)
      clearStore: () =>
        set({
          coupons: [],
          isLoading: false,
          error: null,
          lastFetch: null,
        }),
    }),
    {
      name: "coupon-storage",
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
        coupons: state.coupons,
        lastFetch: state.lastFetch,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

export default useCouponStore;
