export async function askGemini(message: string): Promise<string> {
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_GEMINI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: `You are Drivo AI, a personal assistant for Indian truck drivers.
            Help with road safety, driving tips, and keeping awake during night drives.
            Respond in simple Hindi or English. Keep responses short and clear.`
          },
          { role: "user", content: message }
        ],
      }),
    })
    const data = await response.json()
    return data.choices?.[0]?.message?.content ?? "Koi jawab nahi mila."
  } catch (error) {
    console.error("Groq error:", error)
    return "Sorry, AI assistant is unavailable right now."
  }
}