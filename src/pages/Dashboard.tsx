import { useState, useRef } from "react"
import { signOut } from "firebase/auth"
import { useNavigate } from "react-router-dom"
import { auth } from "../firebase"
import { useAuth } from "../context/AuthContext"
import { saveTrip } from "../services/tripService"
import { useGPS } from "../hooks/useGPS"
import HOSTimer from "../components/HOSTimer"

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [tripActive, setTripActive] = useState(false)
  const [saving, setSaving] = useState(false)
  const startTimeRef = useRef<Date | null>(null)
  const startLocationRef = useRef<{ lat: number; lng: number } | null>(null)
  const secondsRef = useRef(0)
  const { location, distanceKm } = useGPS(tripActive)

  const handleStartTrip = () => {
    startTimeRef.current = new Date()
    startLocationRef.current = location
    setTripActive(true)
  }

  const handleEndTrip = async () => {
    if (!user || !startTimeRef.current) return
    setSaving(true)
    setTripActive(false)

    await saveTrip(user.uid, {
      startTime: startTimeRef.current.toISOString(),
      endTime: new Date().toISOString(),
      durationSeconds: secondsRef.current,
      distanceKm: parseFloat(distanceKm.toFixed(2)),
      startLocation: startLocationRef.current,
      endLocation: location,
    })

    setSaving(false)
    secondsRef.current = 0
  }

  const openMaps = () => {
    if (location) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&origin=${location.lat},${location.lng}`,
        "_blank"
      )
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">

      {/* Header */}
      <div className="bg-gray-800 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-orange-500">🚛 Drivo</h1>
        <button
          onClick={() => signOut(auth)}
          className="text-gray-400 text-sm hover:text-white"
        >
          Logout
        </button>
      </div>

      <div className="px-6 py-6 space-y-4">

        <div>
          <h2 className="text-2xl font-bold">Good day, Driver 👋</h2>
          <p className="text-gray-400 text-sm mt-1">Stay safe on the road</p>
        </div>

        {/* HOS Timer */}
        <HOSTimer
          tripActive={tripActive}
          onTick={(s) => { secondsRef.current = s }}
        />

        {/* GPS Info */}
        <div className="bg-gray-800 rounded-2xl p-5 grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-400 text-sm">Distance</p>
            <p className="text-2xl font-bold text-orange-500">
              {distanceKm.toFixed(1)} km
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">GPS Status</p>
            <p className={`text-lg font-bold ${location ? "text-green-400" : "text-red-400"}`}>
              {location ? "🟢 Active" : "🔴 No Signal"}
            </p>
          </div>
        </div>

        {/* Trip Button */}
        <button
          onClick={tripActive ? handleEndTrip : handleStartTrip}
          disabled={saving}
          className={`w-full py-5 rounded-2xl text-xl font-bold transition ${
            tripActive
              ? "bg-red-500 hover:bg-red-600"
              : "bg-orange-500 hover:bg-orange-600"
          } disabled:opacity-50`}
        >
          {saving ? "Saving..." : tripActive ? "⏹ End Trip" : "▶ Start Trip"}
        </button>

        {/* Navigation Button */}
        <button
          onClick={openMaps}
          className="w-full py-4 rounded-2xl text-lg font-bold bg-blue-600 hover:bg-blue-700 transition"
        >
          🗺 Open Navigation
        </button>

        {/* Trip History Button */}
        <button
          onClick={() => navigate("/trips")}
          className="w-full py-4 rounded-2xl text-lg font-bold bg-gray-700 hover:bg-gray-600 transition"
        >
          📋 View Trip History
        </button>

      </div>
    </div>
  )
}