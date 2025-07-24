export class HalalAPIService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.basicModel = "gpt-3.5-turbo";
    this.advancedModel = "gpt-4-turbo";
    this.systemPromptTokens = 395;
    this.maxConversationTurns = 4;
  }

  static instance = null;

  static async getInstance() {
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("NEXT_PUBLIC_OPENAI_API_KEY not found in environment variables.");
    }

    if (!HalalAPIService.instance) {
      HalalAPIService.instance = new HalalAPIService(apiKey);
    }

    return HalalAPIService.instance;
  }

  estimateTokens(text) {
    return Math.ceil(text.length / 3.8);
  }

  needsAdvancedModel(userMessage) {
    const complexityIndicators = [
      "differences between madhabs",
      "comparative fiqh",
      "scholarly disagreement",
      "complex ruling",
      "theological debate",
      "deep analysis",
      "detailed explanation",
      "differences of opinion",
      "advanced question",
      "complex issue",
      "use gpt-4",
      "complex financial structure",
      "intricate business model",
      "detailed investment analysis",
    ];
    const lowerCaseMsg = userMessage.toLowerCase();
    return complexityIndicators.some((indicator) => lowerCaseMsg.includes(indicator));
  }

  isUserGreeting(userMessage) {
    const greetingPatterns = [
      "assalam",
      "assalamu alaikum",
      "السلام عليكم",
      "salam",
      "hello",
      "hi there",
      "hey there",
      "good morning",
      "good afternoon",
      "good evening",
      "greetings",
    ];
    const messageLower = userMessage.toLowerCase().trim();
    return greetingPatterns.some(
      (greeting) => messageLower.startsWith(greeting) || (messageLower.length <= 20 && messageLower.includes(greeting))
    );
  }

  isConversational(userMessage) {
    const conversationalPatterns = [
      "hello",
      "hi there",
      "hey there",
      "good morning",
      "good afternoon",
      "good evening",
      "assalam",
      "salam",
      "السلام عليكم",
      "thank you",
      "thanks",
      "jazakallahu khair",
      "barakallahu feek",
      "bye",
      "goodbye",
      "see you",
      "take care",
    ];
    const messageLower = userMessage.toLowerCase().trim();
    return conversationalPatterns.some(
      (pattern) =>
        messageLower.startsWith(pattern) ||
        (messageLower.length <= 15 && messageLower.includes(pattern)) ||
        messageLower.includes("bye") ||
        messageLower.includes("goodbye")
    );
  }

  addSmartGreeting(response, userMessage) {
    const responseLower = response.toLowerCase().trim();
    if (
      responseLower.startsWith("assalamu") ||
      responseLower.startsWith("wa alaikum") ||
      responseLower.startsWith("السلام عليكم")
    ) {
      return response;
    }

    const messageLower = userMessage.toLowerCase().trim();
    const hasIslamicGreeting =
      messageLower.startsWith("assalam") || messageLower.startsWith("salam") || messageLower.includes("السلام عليكم");

    let cleanResponse = response;
    const greetingsToRemove = [
      /^hello[! ]*/i,
      /^hi[! ]*/i,
      /^hey[! ]*/i,
      /^good morning[! ]*/i,
      /^good afternoon[! ]*/i,
      /^good evening[! ]*/i,
    ];
    for (const pattern of greetingsToRemove) {
      cleanResponse = cleanResponse.replace(pattern, "").trim();
    }

    if (hasIslamicGreeting) {
      return `Wa Alaikum Assalam!\n\n${cleanResponse}`;
    } else if (this.isUserGreeting(userMessage)) {
      return `Assalamu Alaikum!\n\n${cleanResponse}`;
    }

    return response;
  }

  getSystemPrompt(userMessage) {
    const isConversational = this.isConversational(userMessage);
    if (isConversational) {
      return `You are Farah, a friendly Muslim lifestyle companion.
CONVERSATIONAL RULES:
1. Respond naturally to greetings and casual conversation
2. Be warm and friendly
3. Use Islamic expressions naturally (In sha Allah, Alhamdulillah, Barakallahu feeka)
4. Keep responses conversational and brief for simple greetings
5. NEVER add greetings like "Assalam" or "Hello" to your responses - the system will handle greetings appropriately
6. Match the user's tone and energy
7. Focus on the content of your response without adding introductory greetings`;
    } else {
      return `You are Farah, a knowledgeable Muslim lifestyle companion.
GUIDANCE RULES:
1. Provide helpful Islamic guidance for daily life
2. Cover halal finance, food, career, relationships, parenting, health, entertainment, travel
3. For religious questions: reference Quran and authentic Hadith with sources
4. Use Islamic expressions natburally (In sha Allah, Alhamdulillah, Barakallahu feeka)
5. Offer practical halal alternatives and value-based choices
6. Be warm and supportive with detailed, helpful responses
7. NEVER add greetings like "Assalam" or "Hello" to your responses - focus directly on answering the question
8. Start your response directly with the information requested`;
    }
  }

  async getHalalResponse({ userMessage, messageHistory = [], courseMaterial = {}, forceAdvancedModel = false }) {
    const systemPrompt = this.getSystemPrompt(userMessage);

    const messages = [{ role: "system", content: systemPrompt }];

    if (messageHistory.length > 0) {
      let trimmedHistory = messageHistory;
      if (messageHistory.length > this.maxConversationTurns * 2) {
        trimmedHistory = [messageHistory[0], ...messageHistory.slice(-(this.maxConversationTurns * 2) + 1)];
      }

      for (const msg of trimmedHistory) {
        messages.push({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.text,
        });
      }
    }

    messages.push({ role: "user", content: userMessage });

    const useAdvancedModel = forceAdvancedModel || this.needsAdvancedModel(userMessage);
    const modelToUse = useAdvancedModel ? this.advancedModel : this.basicModel;

    console.log(`Using model: ${modelToUse} for query: "${userMessage.substring(0, 50)}..."`);

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: modelToUse,
          messages,
          temperature: 0.7,
          max_tokens: 800,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const rawResponse = data.choices[0].message.content.trim();

        if (data.choices[0].finish_reason === "length") {
          console.warn("Response was truncated due to max_tokens limit");
        }

        const finalResponse = this.addSmartGreeting(rawResponse, userMessage);
        console.log(`Question type: ${this.isConversational(userMessage) ? "Conversational" : "Educational"}`);
        console.log(
          `Has Islamic greeting: ${
            userMessage.toLowerCase().includes("assalam") || userMessage.toLowerCase().includes("salam")
          }`
        );
        return finalResponse;
      } else {
        const errorBody = await response.text();
        console.error(`Chat completion error: ${response.status} - ${errorBody}`);
        throw new Error(`API error: ${response.status}`);
      }
    } catch (e) {
      console.error(`Error communicating with OpenAI: ${e}`);
      throw new Error("Error communicating with OpenAI");
    }
  }
}
