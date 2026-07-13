import { useState } from "react"
import { signOut } from "firebase/auth"
import { auth } from "../firebase"
import HOSTimer from "../components/HOSTimer"

export default function Dashboard() {
  const [tripActive, setTripActive] = useState(false)

  const handleLogout = async () => {
    await signOut(auth)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      
      {/* Header */}
      <div className="bg-gray-800 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-orange-500">🚛 Drivo</h1>
        <button
          onClick={handleLogout}
          className="text-gray-400 text-sm hover:text-white"
        >
          Logout
        </button>
      </div>

      <div className="px-6 py-6 space-y-6">

        {/* Welcome */}
        <div>
          <h2 className="text-2xl font-bold">Good day, Driver 👋</h2>
          <p className="text-gray-400 text-sm mt-1">Stay safe on the road</p>
        </div>

        {/* HOS Timer */}
        <HOSTimer tripActive={tripActive} />

        {/* Trip Button */}
        <button
          onClick={() => setTripActive(!tripActive)}
          className={`w-full py-5 rounded-2xl text-xl font-bold transition ${
            tripActive
              ? "bg-red-500 hover:bg-red-600"
              : "bg-orange-500 hover:bg-orange-600"
          }`}
        >
          {tripActive ? "⏹ End Trip" : "▶ Start Trip"}
        </button>

        {/* Status Card */}
        <div className="bg-gray-800 rounded-2xl p-5">
          <p className="text-gray-400 text-sm">Current Status</p>
          <p className={`text-2xl font-bold mt-1 ${tripActive ? "text-green-400" : "text-gray-500"}`}>
            {tripActive ? "🟢 On Trip" : "⚪ Off Duty"}
          </p>
        </div>

      </div>
    </div>
  )
}