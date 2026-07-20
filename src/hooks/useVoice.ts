export function useVoice(onResult: (text: string) => void) {
  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      alert("Chrome browser use karo voice ke liye")
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = "en-IN"
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognition.continuous = false

    recognition.start()

    recognition.onstart = () => console.log("Listening...")
    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript
      onResult(text)
    }
    recognition.onerror = (event: any) => {
      console.error("Voice error:", event.error)
    }
  }

  const speak = (text: string) => {
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)

    // Best voice dhundho
    const voices = window.speechSynthesis.getVoices()
    
    // Priority order mein voice select karo
    const preferredVoice = 
      voices.find(v => v.name.includes("Google UK English Female")) ||
      voices.find(v => v.name.includes("Google US English")) ||
      voices.find(v => v.name.includes("Microsoft Zira")) ||
      voices.find(v => v.name.includes("Microsoft David")) ||
      voices.find(v => v.lang === "en-IN") ||
      voices.find(v => v.lang.startsWith("en"))

    if (preferredVoice) {
      utterance.voice = preferredVoice
      console.log("Using voice:", preferredVoice.name)
    }

    utterance.lang = "en-IN"
    utterance.rate = 0.85
    utterance.pitch = 1.0
    utterance.volume = 1.0

    window.speechSynthesis.speak(utterance)
  }

  return { startListening, speak }
}