import React, { createContext } from 'react'

export const authDataContext = createContext()
function AuthContext({children}) {
    // Local dev  -> backend on localhost:8000
  // Production -> VITE_SERVER_URL (backend URL). If it is not set, "" is used,
  // meaning same-origin calls (works with the Render /api rewrite rule).
  const serverUrl = import.meta.env.PROD
    ? (import.meta.env.VITE_SERVER_URL || "https://clothing-e-commerce-platform.onrender.com").replace(/\/$/, "")
    : "http://localhost:8000";

    let value = {
      serverUrl
    }
  return (
    <div>
        <authDataContext.Provider value={value}>
            {children}
        </authDataContext.Provider>
      
    </div>
  )
}

export default AuthContext
