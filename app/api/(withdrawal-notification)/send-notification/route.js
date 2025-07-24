"use server";

import { createClient } from "@/lib/supabase/server";

export async function updateWithdrawalStatus(withdrawalId, newStatus) {
  try {
    const supabase = await createClient();
    // Fetch current withdrawal
    const { data: currentWithdrawal, error: fetchError } = await supabase
      .from("withdrawals")
      .select("*")
      .eq("id", withdrawalId)
      .single();

    if (fetchError) {
      throw new Error(`Failed to fetch withdrawal: ${fetchError.message}`);
    }

    // Update status
    const { data, error } = await supabase
      .from("withdrawals")
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", withdrawalId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update withdrawal: ${error.message}`);
    }

    // Send email if status changed from "pending"
    if (currentWithdrawal.status === "pending" && newStatus !== "pending") {
      try {
        const notifyRes = await fetch(
          "https://wuezqjyaegvqyuumiemr.supabase.co/functions/v1/send-withdrawal-notification",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({
              withdrawalId,
              newStatus,
              sellerId: currentWithdrawal.seller_id,
              amount: currentWithdrawal.amount,
              email: currentWithdrawal.seller_email, // if exists
            }),
          }
        );

        if (!notifyRes.ok) {
          console.warn("Email notification failed but status updated.");
        }
      } catch (notifyErr) {
        console.error("Notification error:", notifyErr);
        // Don't block on notification errors
      }
    }

    return { success: true, data };
  } catch (error) {
    console.error("Update status error:", error);
    return { success: false, error: error.message };
  }
}
