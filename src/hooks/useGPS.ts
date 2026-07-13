import { useState, useEffect, useRef } from "react"

interface Location {
  lat: number
  lng: number
}

export function useGPS(active: boolean) {
  const [location, setLocation] = useState<Location | null>(null)
  const [distanceKm, setDistanceKm] = useState(0)
  const lastLocation = useRef<Location | null>(null)

  function haversine(loc1: Location, loc2: Location): number {
    const R = 6371
    const dLat = ((loc2.lat - loc1.lat) * Math.PI) / 180
    const dLng = ((loc2.lng - loc1.lng) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((loc1.lat * Math.PI) / 180) *
      Math.cos((loc2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  }

  useEffect(() => {
    if (!active) {
      lastLocation.current = null
      setDistanceKm(0)
      return
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const newLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setLocation(newLoc)
        if (lastLocation.current) {
          const d = haversine(lastLocation.current, newLoc)
          if (d > 0.05) setDistanceKm((prev) => prev + d)
        }
        lastLocation.current = newLoc
      },
      (err) => console.error("GPS error:", err),
      { enableHighAccuracy: true, distanceFilter: 50 } as any
    )

    return () => navigator.geolocation.clearWatch(watchId)
  }, [active])

  return { location, distanceKm }
}