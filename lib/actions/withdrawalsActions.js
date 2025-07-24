"use server";
import supabase from "@/lib/supabase/supabase";

import { createClient } from "@/lib/supabase/server";

export async function fetchWithdrawals() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("withdrawals").select("*").order("created_at", { ascending: false });

    // console.log("Fetched Withdrawals:", data);

    if (error) {
      console.error("Supabase error:", error);
      throw new Error(`Failed to fetch Withdrawals: ${error.message}`);
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error("Fetch Withdrawals error:", error);
    return { success: false, error: error.message, data: [] };
  }
}

// export async function updateWithdrawalStatus(withdrawalId, newStatus) {
//   const supabase = await createClient();
//   const {
//     data: { user },
//     error: userError,
//   } = await supabase.auth.getUser();

//   if (userError || !user) {
//     throw new Error("Authentication required");
//   }

//   // First get withdrawal details for the email
//   const { data: withdrawal, error: fetchError } = await supabase
//     .from("withdrawals")
//     .select("seller_id, amount, email")
//     .eq("id", withdrawalId)
//     .single();

//   if (fetchError) {
//     throw new Error(`Failed to fetch withdrawal: ${fetchError.message}`);
//   }

//   // Use the database function that bypasses RLS
//   const { data, error } = await supabase.rpc("update_withdrawal_status_system", {
//     withdrawal_id: withdrawalId,
//     new_status: newStatus,
//   });

//   if (error) {
//     throw new Error(`Failed to update withdrawal: ${error.message}`);
//   }

//   // Email notification
//   try {
//     await fetch("https://wuezqjyaegvqyuumiemr.supabase.co/functions/v1/send-withdrawal-notification", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
//       },
//       body: JSON.stringify({
//         withdrawalId,
//         newStatus,
//         sellerId: withdrawal.seller_id,
//         amount: withdrawal.amount,
//         email: withdrawal.email,
//       }),
//     });
//   } catch (emailErr) {
//     console.error("Email error:", emailErr);
//   }

//   return { success: true, data: data || [] };
// }

export async function updateWithdrawalStatus(withdrawalId, newStatus) {
  const supabase = createClient();
  const { data, error } = await supabase.functions.invoke("send-withdrawal-notification", {
    body: { name: "Functions" },
  });
}
