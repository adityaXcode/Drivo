const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export function startPingService() {
  setInterval(async () => {
    try {
      await fetch(`${BACKEND_URL}/health`)
      console.log("Backend pinged — awake!")
    } catch (e) {
      console.log("Ping failed")
    }
  }, 840000) // har 14 minute mein ping
}