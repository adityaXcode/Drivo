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
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: message }] }],
          systemInstruction: {
            parts: [{
              text: `You are Drivo AI, a personal assistant for Indian truck drivers.
              Help with road safety, driving tips, weather, routes, keeping awake during night drives.
              Respond in simple Hindi or English. Keep responses short and clear.`
            }]
          }
        }),
      }
    )
    const data = await response.json()
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text
    res.json({ reply: reply ?? "Koi jawab nahi mila." })
  } catch (error) {
    console.error("Gemini error:", error)
    res.status(500).json({ reply: "AI unavailable right now." })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))