"use server";

import supabase from "../supabase/supabase";

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
