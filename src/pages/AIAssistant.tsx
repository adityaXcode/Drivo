import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { askGemini } from "../services/geminiService"

interface Message {
  role: "user" | "ai"
  text: string
}

const QUICK_QUESTIONS = [
  "Neend aa rahi hai, kya karun? 😴",
  "Night driving tips do",
  "Truck maintenance tips",
  "Safe driving tips",
]

export default function AIAssistant() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text: "Namaste Driver! 🚛 Main Drivo AI hoon. Aapki kaise madad kar sakta hoon? Road safety, driving tips, ya kuch aur?",
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return
    setInput("")
    setMessages((prev) => [...prev, { role: "user", text }])
    setLoading(true)

    const reply = await askGemini(text)
    setMessages((prev) => [...prev, { role: "ai", text: reply }])
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">

      {/* Header */}
      <div className="bg-gray-800 px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate("/dashboard")} className="text-orange-500 text-xl">←</button>
        <div>
          <h1 className="text-lg font-bold">Drivo AI 🤖</h1>
          <p className="text-gray-400 text-xs">Your personal road assistant</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs px-4 py-3 rounded-2xl text-sm ${
                msg.role === "user"
                  ? "bg-orange-500 text-white rounded-br-none"
                  : "bg-gray-700 text-white rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-700 px-4 py-3 rounded-2xl rounded-bl-none">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick Questions */}
      <div className="px-4 py-2 flex gap-2 overflow-x-auto">
        {QUICK_QUESTIONS.map((q, i) => (
          <button
            key={i}
            onClick={() => sendMessage(q)}
            className="whitespace-nowrap bg-gray-700 text-xs px-3 py-2 rounded-full hover:bg-gray-600 transition"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="px-4 py-4 bg-gray-800 flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
          placeholder="Kuch bhi pucho..."
          className="flex-1 bg-gray-700 text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 text-sm"
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={loading}
          className="bg-orange-500 hover:bg-orange-600 px-5 py-3 rounded-xl font-bold disabled:opacity-50 transition"
        >
          ➤
        </button>
      </div>

    </div>
  )
}
