import { create } from "zustand";
import { persist } from "zustand/middleware";

const useUserStore = create(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      role: null, // 'user' | 'instructor' | 'admin'
      isPremium: false,
      enrolledCourses: [],

      // Actions
      login: (user) => set({ user, isLoggedIn: true }),
      logout: () =>
        set({
          user: null,
          isLoggedIn: false,
          role: null,
          isPremium: false,
          enrolledCourses: [],
        }),
      setUser: (user) => set({ user }),
      setRole: (role) => set({ role }),
      setPremium: (value) => set({ isPremium: value }),
      setEnrolledCourses: (courses) => set({ enrolledCourses: courses }),
    }),
    {
      name: "user-storage", // localStorage key
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
        role: state.role,
        isPremium: state.isPremium,
        enrolledCourses: state.enrolledCourses,
      }),
    }
  )
);

export default useUserStore;
  