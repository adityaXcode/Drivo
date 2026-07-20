import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { saveExpense, getExpenses } from "../services/expenseService"
import type { Expense, ExpenseCategory } from "../services/expenseService"

const CATEGORIES: { value: ExpenseCategory; label: string; emoji: string }[] = [
  { value: "fuel", label: "Fuel", emoji: "⛽" },
  { value: "toll", label: "Toll", emoji: "🛣️" },
  { value: "food", label: "Food", emoji: "🍱" },
  { value: "parking", label: "Parking", emoji: "🅿️" },
  { value: "repair", label: "Repair", emoji: "🔧" },
  { value: "other", label: "Other", emoji: "📦" },
]

export default function Expenses() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [category, setCategory] = useState<ExpenseCategory>("fuel")
  const [amount, setAmount] = useState("")
  const [note, setNote] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!user) return
    getExpenses(user.uid).then((data) => {
      setExpenses(data.reverse())
      setLoading(false)
    })
  }, [user])

  const handleSave = async () => {
    if (!user || !amount) return
    setSaving(true)

    const expense: Expense = {
      id: Date.now().toString(),
      category,
      amount: parseFloat(amount),
      note,
      date: new Date().toISOString(),
    }

    // Pehle UI mein dikha do — instant
    setExpenses((prev) => [expense, ...prev])
    setAmount("")
    setNote("")
    setShowForm(false)
    setSaving(false)

    // Baad mein Firestore mein save karo — background mein
    await saveExpense(user.uid, expense)
  }

  const totalByCategory = (cat: ExpenseCategory) =>
    expenses
      .filter((e) => e.category === cat)
      .reduce((sum, e) => sum + e.amount, 0)

  const totalAll = expenses.reduce((sum, e) => sum + e.amount, 0)

  return (
    <div className="min-h-screen bg-gray-900 text-white">

      {/* Header */}
      <div className="bg-gray-800 px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate("/dashboard")} className="text-orange-500 text-xl">←</button>
        <h1 className="text-xl font-bold">Expense Tracker</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="ml-auto bg-orange-500 px-4 py-2 rounded-xl text-sm font-bold"
        >
          + Add
        </button>
      </div>

      <div className="px-6 py-6 space-y-4">

        {/* Total */}
        <div className="bg-gray-800 rounded-2xl p-5">
          <p className="text-gray-400 text-sm">Total Expenses</p>
          <p className="text-3xl font-bold text-orange-500">₹{totalAll.toFixed(0)}</p>
        </div>

        {/* Category Summary */}
        <div className="grid grid-cols-3 gap-3">
          {CATEGORIES.map((cat) => (
            <div key={cat.value} className="bg-gray-800 rounded-xl p-3 text-center">
              <p className="text-2xl">{cat.emoji}</p>
              <p className="text-xs text-gray-400 mt-1">{cat.label}</p>
              <p className="text-white font-bold text-sm">₹{totalByCategory(cat.value).toFixed(0)}</p>
            </div>
          ))}
        </div>

        {/* Add Form */}
        {showForm && (
          <div className="bg-gray-800 rounded-2xl p-5 space-y-4">
            <p className="font-bold text-lg">Add Expense</p>

            {/* Category Select */}
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`py-2 rounded-xl text-sm font-bold transition ${
                    category === cat.value
                      ? "bg-orange-500 text-white"
                      : "bg-gray-700 text-gray-300"
                  }`}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>

            <input
              type="number"
              placeholder="Amount (₹)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-500"
            />

            <input
              type="text"
              placeholder="Note (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-500"
            />

            <button
              onClick={handleSave}
              disabled={saving || !amount}
              className="w-full bg-orange-500 hover:bg-orange-600 py-3 rounded-xl font-bold disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Expense"}
            </button>
          </div>
        )}

        {/* Expense List */}
        {loading && <p className="text-gray-400 text-center">Loading...</p>}

        {!loading && expenses.length === 0 && (
          <div className="text-center mt-10">
            <p className="text-5xl mb-3">💰</p>
            <p className="text-gray-400">No expenses yet. Add your first one!</p>
          </div>
        )}

        <div className="space-y-3">
          {expenses.map((exp, i) => {
            const cat = CATEGORIES.find((c) => c.value === exp.category)
            return (
              <div key={exp.id || i} className="bg-gray-800 rounded-2xl p-4 flex items-center gap-4">
                <p className="text-3xl">{cat?.emoji}</p>
                <div className="flex-1">
                  <p className="font-bold">{cat?.label}</p>
                  {exp.note && <p className="text-gray-400 text-sm">{exp.note}</p>}
                  <p className="text-gray-500 text-xs">
                    {new Date(exp.date).toLocaleDateString("en-IN")}
                  </p>
                </div>
                <p className="text-orange-500 font-bold text-lg">₹{exp.amount}</p>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}