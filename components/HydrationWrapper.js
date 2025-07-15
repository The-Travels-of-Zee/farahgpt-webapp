// components/HydrationWrapper.js
"use client";
import { useEffect, useState } from "react";
import useUserStore from "@/store/userStore";

const HydrationWrapper = ({ children }) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const setHasHydrated = useUserStore((state) => state.setHasHydrated);

  useEffect(() => {
    setIsHydrated(true);
    setHasHydrated(true);
  }, [setHasHydrated]);

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return children;
};

export default HydrationWrapper;
