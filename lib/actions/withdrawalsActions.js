import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function fetchWithdrawals(userId) {
  const supabase = createSupabaseServerClient();

  let query = supabase.from("withdrawals").select("*");
  if (userId) query = query.eq("user_id", userId);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return { success: true, data: data || [] };
}

export async function updateWithdrawalStatus(withdrawalId, newStatus) {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("withdrawals")
    .update({
      status: newStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", withdrawalId)
    .select();

  if (error) throw new Error(error.message);

  // Email notification
  try {
    await fetch("/api/send-notification", {
      method: "POST",
      body: JSON.stringify({ withdrawalId, newStatus }),
      headers: { "Content-Type": "application/json" },
    });
  } catch (emailErr) {
    console.error("Email error:", emailErr);
  }

  return { success: true, data: data || [] };
}
