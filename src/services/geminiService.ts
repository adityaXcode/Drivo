const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001"

export async function askGemini(message: string): Promise<string> {
  try {
    const response = await fetch(`${BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    })
    const data = await response.json()
    return data.reply ?? "Koi jawab nahi mila."
  } catch (error) {
    console.error("Backend error:", error)
    return "Sorry, AI assistant is unavailable right now."
  }
}