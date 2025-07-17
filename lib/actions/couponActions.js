// actions/couponActions.js
"use server";

import supabase from "../supabase/supabase";

// Server action to create a new coupon code
export async function createCouponCode(couponData) {
  try {
    const { code, discount, user_id } = couponData;

    // Validate input
    if (!code || !discount || !user_id) {
      throw new Error("Missing required fields: code, discount, or user_id");
    }

    // Check if user exists in sellers table
    const { data: seller, error: sellerError } = await supabase.from("sellers").select("user_id").eq("user_id", user_id).single();

    if (sellerError || !seller) {
      throw new Error("Invalid instructor ID or instructor not found");
    }

    // Check if coupon code already exists
    const { data: existingCoupon, error: checkError } = await supabase
      .from("promo_codes")
      .select("id")
      .eq("code", code)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 is "not found" error, which is expected
      throw new Error(`Error checking existing coupon: ${checkError.message}`);
    }

    if (existingCoupon) {
      throw new Error("Coupon code already exists");
    }

    // Insert the new coupon
    const { data, error } = await supabase
      .from("promo_codes")
      .insert([
        {
          code: code,
          discount: discount,
          user_id: user_id,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      throw new Error(`Failed to create coupon: ${error.message}`);
    }

    console.log("Created coupon:", data);
    return { success: true, data: data };
  } catch (error) {
    console.error("Create coupon error:", error);
    return { success: false, error: error.message };
  }
}

// Server action to fetch all coupons for a specific instructor
export async function fetchInstructorCoupons(instructorId) {
  try {
    if (!instructorId) {
      throw new Error("Instructor ID is required");
    }

    const { data, error } = await supabase
      .from("promo_codes")
      .select("*")
      .eq("user_id", instructorId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      throw new Error(`Failed to fetch coupons: ${error.message}`);
    }

    console.log("Fetched instructor coupons:", data);
    return { success: true, data: data || [] };
  } catch (error) {
    console.error("Fetch instructor coupons error:", error);
    return { success: false, error: error.message, data: [] };
  }
}

// Server action to fetch all coupons (admin only)
export async function fetchAllCoupons() {
  try {
    const { data, error } = await supabase
      .from("promo_codes")
      .select(
        `
        *,
        sellers (
          id,
          name,
          email
        )
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      throw new Error(`Failed to fetch all coupons: ${error.message}`);
    }

    console.log("Fetched all coupons:", data);
    return { success: true, data: data || [] };
  } catch (error) {
    console.error("Fetch all coupons error:", error);
    return { success: false, error: error.message, data: [] };
  }
}

// Server action to validate a coupon code
export async function validateCouponCode(code) {
  try {
    if (!code) {
      throw new Error("Coupon code is required");
    }

    const { data, error } = await supabase
      .from("promo_codes")
      .select(
        `
        *,
        sellers (
          id,
          name
        )
      `
      )
      .eq("code", code.toUpperCase())
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return { success: false, error: "Invalid coupon code" };
      }
      throw new Error(`Failed to validate coupon: ${error.message}`);
    }

    console.log("Validated coupon:", data);
    return { success: true, data: data };
  } catch (error) {
    console.error("Validate coupon error:", error);
    return { success: false, error: error.message };
  }
}

// Server action to delete a coupon code
export async function deleteCouponCode(couponId) {
  try {
    if (!couponId) {
      throw new Error("Coupon ID is required");
    }

    const { data, error } = await supabase.from("promo_codes").delete().eq("id", couponId).select().single();

    if (error) {
      console.error("Supabase error:", error);
      throw new Error(`Failed to delete coupon: ${error.message}`);
    }

    console.log("Deleted coupon:", data);
    return { success: true, data: data };
  } catch (error) {
    console.error("Delete coupon error:", error);
    return { success: false, error: error.message };
  }
}

// Server action to update a coupon code
export async function updateCouponCode(couponId, updateData) {
  try {
    if (!couponId) {
      throw new Error("Coupon ID is required");
    }

    const { data, error } = await supabase.from("promo_codes").update(updateData).eq("id", couponId).select().single();

    if (error) {
      console.error("Supabase error:", error);
      throw new Error(`Failed to update coupon: ${error.message}`);
    }

    console.log("Updated coupon:", data);
    return { success: true, data: data };
  } catch (error) {
    console.error("Update coupon error:", error);
    return { success: false, error: error.message };
  }
}

// Server action to get coupon usage statistics
export async function getCouponStats(instructorId) {
  try {
    if (!instructorId) {
      throw new Error("Instructor ID is required");
    }

    // Get total number of coupons created by instructor
    const { data: totalCoupons, error: totalError } = await supabase
      .from("promo_codes")
      .select("id", { count: "exact" })
      .eq("user_id", instructorId);

    if (totalError) {
      throw new Error(`Failed to get coupon stats: ${totalError.message}`);
    }

    // You can extend this to include usage stats if you have a separate table
    // for tracking coupon usage/redemptions

    const stats = {
      totalCoupons: totalCoupons.length,
      // activeCoupons: activeCoupons.length,
      // usedCoupons: usedCoupons.length,
      // totalSavings: totalSavings
    };

    return { success: true, data: stats };
  } catch (error) {
    console.error("Get coupon stats error:", error);
    return { success: false, error: error.message };
  }
}
