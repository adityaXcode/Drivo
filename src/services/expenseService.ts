import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore"
import { db } from "../firebase"

export type ExpenseCategory = "fuel" | "toll" | "food" | "parking" | "repair" | "other"

export interface Expense {
  id?: string
  category: ExpenseCategory
  amount: number
  note: string
  date: string
  createdAt?: any
}

export async function saveExpense(userId: string, expense: Expense) {
  const ref = collection(db, "users", userId, "expenses")
  await addDoc(ref, { ...expense, createdAt: serverTimestamp() })
}

export async function getExpenses(userId: string): Promise<Expense[]> {
  const ref = collection(db, "users", userId, "expenses")
  const snapshot = await getDocs(ref)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Expense))
}