// pages/api/chat.js
import { HalalAPIService } from "@/lib/openai/halalApiService";

export async function POST(req) {
  try {
    const body = await req.json();
    const { userMessage, messageHistory = [] } = body;

    const halalService = await HalalAPIService.getInstance();
    const response = await halalService.getHalalResponse({
      userMessage,
      messageHistory,
    });

    return new Response(JSON.stringify({ response }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("API Error:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
