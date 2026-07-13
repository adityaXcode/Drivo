import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore"
import { db } from "../firebase"

export interface Trip {
  id?: string
  startTime: string
  endTime: string
  durationSeconds: number
  distanceKm: number
  startLocation: { lat: number; lng: number } | null
  endLocation: { lat: number; lng: number } | null
}

export async function saveTrip(userId: string, trip: Trip) {
  const ref = collection(db, "users", userId, "trips")
  await addDoc(ref, { ...trip, createdAt: serverTimestamp() })
}

export async function getTrips(userId: string): Promise<Trip[]> {
  const ref = collection(db, "users", userId, "trips")
  const snapshot = await getDocs(ref)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Trip))
}