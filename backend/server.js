import express from "express"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.get("/health", (req, res) => {
  res.json({ status: "ok" })
})

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GEMINI_API_KEY}`,
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
    const reply = data.choices?.[0]?.message?.content
    res.json({ reply: reply ?? "Koi jawab nahi mila." })
  } catch (error) {
    console.error("Error:", error)
    res.status(500).json({ reply: "AI unavailable right now." })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))