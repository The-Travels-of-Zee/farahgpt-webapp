import { useState } from "react";

export function useHalalChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = async (userMessage) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userMessage,
          messageHistory: messages.map((msg) => ({
            sender: msg.role,
            text: msg.content,
          })),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages((prev) => [
          ...prev,
          { role: "user", content: userMessage },
          { role: "assistant", content: data.response },
        ]);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (e) {
      console.error("Fetch error:", e);
      setError("Failed to reach server");
    }

    setLoading(false);
  };

  return { messages, loading, error, sendMessage };
}
