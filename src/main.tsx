import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import { startPingService } from './services/pingService'
import './index.css'
import App from './App.tsx'

registerSW({ immediate: true })
startPingService()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)