export interface WeatherData {
  city: string
  temp: number
  condition: string
  humidity: number
  windSpeed: number
  alert: string | null
}

export async function getWeather(lat: number, lon: number): Promise<WeatherData | null> {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${import.meta.env.VITE_WEATHER_API_KEY}&units=metric`
    )
    const data = await res.json()

    const condition = data.weather[0].main
    const temp = Math.round(data.main.temp)
    const humidity = data.main.humidity
    const windSpeed = data.wind.speed

    // Alert logic
    let alert = null
    if (temp > 42) alert = "🌡️ Extreme heat ahead! Stay hydrated."
    else if (condition === "Thunderstorm") alert = "⛈️ Thunderstorm ahead! Drive carefully."
    else if (condition === "Fog") alert = "🌫️ Dense fog ahead! Reduce speed."
    else if (condition === "Snow") alert = "❄️ Snow on road! Drive slow."
    else if (windSpeed > 15) alert = "💨 Strong winds ahead! Be careful."
    else if (humidity > 90) alert = "🌧️ Heavy rain possible ahead!"

    return {
      city: data.name,
      temp,
      condition,
      humidity,
      windSpeed,
      alert,
    }
  } catch (error) {
    console.error("Weather error:", error)
    return null
  }
}