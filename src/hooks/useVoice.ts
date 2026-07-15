export function useVoice(onResult: (text: string) => void) {
  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      alert("Ye browser voice support nahi karta. Chrome use karo.")
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = "en-IN"
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognition.continuous = false

    recognition.start()

    recognition.onstart = () => {
      console.log("Listening started...")
    }

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript
      console.log("Heard:", text)
      onResult(text)
    }

    recognition.onerror = (event: any) => {
      console.error("Voice error:", event.error)
      if (event.error === "not-allowed") {
        alert("Microphone permission do — browser settings mein jaake allow karo.")
      }
    }
  }

  const speak = (text: string) => {
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)

    const voices = window.speechSynthesis.getVoices()
    const indianVoice = voices.find(
      (v) => v.lang === "en-IN" || v.name.includes("India")
    )
    if (indianVoice) utterance.voice = indianVoice

    utterance.lang = "en-IN"
    utterance.rate = 0.85
    utterance.pitch = 1.1
    utterance.volume = 1

    window.speechSynthesis.speak(utterance)
  }

  return { startListening, speak }
}