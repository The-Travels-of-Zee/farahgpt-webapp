"use client";
import TabNavigation from "@/components/Dashboard/TabNavigation";
import { getSubscriptionStatus } from "@/lib/actions/subscriptionActions";
import useUserStore from "@/store/userStore";
import { useEffect } from "react";

const InstructorDashboardPage = () => {
  const { user, setSubscriptionTier } = useUserStore();
  useEffect(() => {
    if (user?.id) {
      loadSubscriptionStatus();
    }
  }, [user?.id]);

  const loadSubscriptionStatus = async () => {
    try {
      const result = await getSubscriptionStatus(user.id);
      if (result.success) {
        setSubscriptionTier(result.data.subscription_tier || "free");
        console.log("Current subscription tier:", result.data.subscription_tier);
      }
    } catch (error) {
      console.error("Error loading subscription status:", error);
    }
  };

  return (
    <main>
      <TabNavigation />
    </main>
  );
};

export default InstructorDashboardPage;
