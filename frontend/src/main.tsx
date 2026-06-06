import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Create } from './pages/Create.tsx'
import { ClerkProvider } from '@clerk/clerk-react'
import { Watch } from './pages/Watch.tsx'
import { Channel } from './pages/Channel.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
          <Route path = "/" element={<App/>}></Route>
          <Route path = "/create" element={<ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}><Create/></ClerkProvider>}></Route>
          <Route path = "/watch/:id" element={<ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}><Watch/></ClerkProvider>}></Route>
          <Route path = "/@/:username" element={<ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}><Channel/></ClerkProvider>}></Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
