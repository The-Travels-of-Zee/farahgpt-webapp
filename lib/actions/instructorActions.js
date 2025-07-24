"use server";

import useUserStore from "@/store/userStore";
import { createClient } from "@/lib/supabase/server";

// Server action to fetch all courses
export async function fetchInstructors() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("sellers").select("*");

    console.log("Fetched Instructors:", data);

    if (error) {
      console.error("Supabase error:", error);
      throw new Error(`Failed to fetch Instructors: ${error.message}`);
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error("Fetch Instructors error:", error);
    return { success: false, error: error.message, data: [] };
  }
}

// Get Instructor profile by ID
export async function getInstructorProfile(userId) {
  try {
    const supabase = await createClient();
    if (!userId) {
      throw new Error("Instructor ID is required");
    }

    const { data, error } = await supabase.from("sellers").select("*").eq("user_id", userId).single();

    if (error) {
      console.error("Supabase error:", error);
      throw new Error(`Failed to fetch instructor profile: ${error.message}`);
    }

    // Update store when getting instructor profile - get fresh actions
    const { setUser } = useUserStore.getState();
    setUser(data);

    return { success: true, data };
  } catch (error) {
    console.error("Get instructor profile error:", error);
    return { success: false, error: error.message };
  }
}
