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

  const speak = async (text: string) => {
    try {
      const response = await fetch(
        "https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "xi-api-key": import.meta.env.VITE_ELEVENLABS_API_KEY,
          },
          body: JSON.stringify({
            text: text,
            model_id: "eleven_monolingual_v1",
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75,
            },
          }),
        }
      )

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)
      audio.play()
    } catch (error) {
      console.error("ElevenLabs error:", error)
      // Fallback to browser voice
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = "en-IN"
      utterance.rate = 0.85
      window.speechSynthesis.speak(utterance)
    }
  }

  return { startListening, speak }
}