import { useEffect, useState } from "react"
import { getWeather } from "../services/weatherService"
import type { WeatherData } from "../services/weatherService"

interface Props {
  lat: number
  lng: number
}

export default function WeatherCard({ lat, lng }: Props) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getWeather(lat, lng).then((data) => {
      setWeather(data)
      setLoading(false)
    })
  }, [lat, lng])

  if (loading) return (
    <div className="bg-gray-800 rounded-2xl p-4">
      <p className="text-gray-400 text-sm">Fetching weather...</p>
    </div>
  )

  if (!weather) return null

  return (
    <div className="bg-gray-800 rounded-2xl p-5">
      <p className="text-gray-400 text-sm mb-2">📍 Weather at your location</p>
      
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <p className="text-gray-400 text-xs">Location</p>
          <p className="text-white font-bold">{weather.city}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs">Temperature</p>
          <p className="text-white font-bold">{weather.temp}°C</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs">Condition</p>
          <p className="text-white font-bold">{weather.condition}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs">Wind</p>
          <p className="text-white font-bold">{weather.windSpeed} m/s</p>
        </div>
      </div>

      {weather.alert && (
        <div className="bg-red-900 border border-red-500 rounded-xl p-3 mt-2">
          <p className="text-red-300 font-semibold text-sm">{weather.alert}</p>
        </div>
      )}
    </div>
  )
}