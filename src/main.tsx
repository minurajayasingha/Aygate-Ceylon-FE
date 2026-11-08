import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@fontsource/cormorant-garamond/400.css'
import '@fontsource/cormorant-garamond/500.css'
import '@fontsource/cormorant-garamond/600.css'
import '@fontsource/cormorant-garamond/700.css'
import '@fontsource/dm-sans/200.css'
import '@fontsource/dm-sans/300.css'
import '@fontsource/dm-sans/400.css'
import '@fontsource/dm-sans/500.css'
import '@fontsource/dm-sans/700.css'
import './index.css'
import App from './App'
import { startSmoothScroll } from './lib/smoothScroll'

// The design has fixed 1440px (desktop) and 402px (mobile) frames. Screens slightly
// smaller than a frame scale it down evenly, so the layout stays exactly as designed.
function fitToFrame() {
  const w = window.innerWidth
  const scale = w < 402 ? w / 402 : w >= 1024 && w < 1440 ? w / 1440 : 1
  document.documentElement.style.setProperty('zoom', String(scale))
}
fitToFrame()
window.addEventListener('resize', fitToFrame)
startSmoothScroll()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
