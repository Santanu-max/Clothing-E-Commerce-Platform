import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import axios from 'axios'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AuthContext from './context/AuthContext.jsx'
import UserContext from './context/UserContext.jsx'
import ShopContext from './context/ShopContext.jsx'

// Every axios call (including the relative "/api/..." ones) goes to the backend
// and always sends the login cookie.
axios.defaults.baseURL = import.meta.env.PROD
  ? (import.meta.env.VITE_SERVER_URL || '').replace(/\/$/, '')
  : 'http://localhost:8000'
axios.defaults.withCredentials = true

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <AuthContext>
    <UserContext>
      <ShopContext>
    <App />
    </ShopContext>
    </UserContext>
    </AuthContext>
</BrowserRouter>
  
)
