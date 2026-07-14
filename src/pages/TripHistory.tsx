import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { getTrips } from "../services/tripService"
import type { Trip } from "../services/tripService"
import { useNavigate } from "react-router-dom"

export default function TripHistory() {
  const { user } = useAuth()
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) return
    getTrips(user.uid).then((data) => {
      setTrips(data.reverse())
      setLoading(false)
    })
  }, [user])

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    return `${h}h ${m}m`
  }

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">

      {/* Header */}
      <div className="bg-gray-800 px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate("/dashboard")} className="text-orange-500 text-xl">←</button>
        <h1 className="text-xl font-bold">Trip History</h1>
      </div>

      <div className="px-6 py-6">
        {loading && <p className="text-gray-400 text-center">Loading trips...</p>}

        {!loading && trips.length === 0 && (
          <div className="text-center mt-20">
            <p className="text-5xl mb-4">🚛</p>
            <p className="text-gray-400">No trips yet. Start your first trip!</p>
          </div>
        )}

        <div className="space-y-4">
          {trips.map((trip, index) => (
            <div key={trip.id || index} className="bg-gray-800 rounded-2xl p-5">
              <div className="flex justify-between items-start mb-3">
                <p className="text-orange-500 font-bold">Trip #{trips.length - index}</p>
                <p className="text-gray-400 text-xs">{formatDate(trip.startTime)}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-gray-400 text-xs">Distance</p>
                  <p className="text-white font-bold text-lg">{trip.distanceKm} km</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Duration</p>
                  <p className="text-white font-bold text-lg">{formatDuration(trip.durationSeconds)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}