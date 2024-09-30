import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import PokeReact from './PokeReact'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PokeReact />
  </StrictMode>,
)
