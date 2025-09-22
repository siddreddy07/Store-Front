import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contextApi/AuthContext.jsx'
import { StoreProvider } from './contextApi/StoreContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <AuthProvider>
      <StoreProvider>
    <App />
      </StoreProvider>
    </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
