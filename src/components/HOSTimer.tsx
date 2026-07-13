import { useEffect, useState } from "react"

interface Props {
  tripActive: boolean
}

const MAX_DRIVING_HOURS = 10
const MAX_SECONDS = MAX_DRIVING_HOURS * 3600

export default function HOSTimer({ tripActive }: Props) {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    if (tripActive) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [tripActive])

  // Reset when trip ends
  useEffect(() => {
    if (!tripActive) setSeconds(0)
  }, [tripActive])

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  const percentage = (seconds / MAX_SECONDS) * 100
  const isWarning = percentage >= 80
  const isDanger = percentage >= 100

  return (
    <div className={`rounded-2xl p-5 ${isDanger ? "bg-red-900" : isWarning ? "bg-yellow-900" : "bg-gray-800"}`}>
      
      <p className="text-gray-400 text-sm mb-3">Hours of Service (HOS)</p>

      {/* Time display */}
      <p className={`text-4xl font-mono font-bold ${isDanger ? "text-red-400" : isWarning ? "text-yellow-400" : "text-white"}`}>
        {String(hours).padStart(2, "0")}:
        {String(minutes).padStart(2, "0")}:
        {String(secs).padStart(2, "0")}
      </p>

      <p className="text-gray-400 text-sm mt-1">Max allowed: {MAX_DRIVING_HOURS} hours</p>

      {/* Progress bar */}
      <div className="mt-4 bg-gray-700 rounded-full h-3">
        <div
          className={`h-3 rounded-full transition-all ${isDanger ? "bg-red-500" : isWarning ? "bg-yellow-500" : "bg-orange-500"}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      {/* Alerts */}
      {isDanger && (
        <p className="text-red-400 font-bold mt-3 text-center animate-pulse">
          🚨 LIMIT EXCEEDED — PULL OVER NOW
        </p>
      )}
      {isWarning && !isDanger && (
        <p className="text-yellow-400 font-semibold mt-3 text-center">
          ⚠️ 80% limit reached — plan your rest stop
        </p>
      )}

    </div>
  )
}