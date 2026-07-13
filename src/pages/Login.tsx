import { useState } from "react"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSignup, setIsSignup] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    setError("")
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password)
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-gray-800 p-8 rounded-2xl w-full max-w-md">

        <h1 className="text-3xl font-bold text-orange-500 text-center mb-2">🚛 Drivo</h1>
        <p className="text-gray-400 text-center mb-8">
          {isSignup ? "Create your account" : "Welcome back, Driver"}
        </p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-gray-700 text-white px-4 py-3 rounded-xl mb-4 outline-none focus:ring-2 focus:ring-orange-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-gray-700 text-white px-4 py-3 rounded-xl mb-4 outline-none focus:ring-2 focus:ring-orange-500"
        />

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <button
          onClick={handleSubmit}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition"
        >
          {isSignup ? "Sign Up" : "Login"}
        </button>

        <p className="text-gray-400 text-center mt-6 text-sm">
          {isSignup ? "Already have an account?" : "New to Drivo?"}{" "}
          <span
            onClick={() => setIsSignup(!isSignup)}
            className="text-orange-500 cursor-pointer font-semibold"
          >
            {isSignup ? "Login" : "Sign Up"}
          </span>
        </p>

      </div>
    </div>
  )
}