import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { GameProvider } from './context/GameContext'

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* BrowserRouter habilita el sistema de rutas */}
    <BrowserRouter>
      {/* AuthProvider expone el usuario a toda la app */}
      <AuthProvider>
        {/* GameProvider expone el estado del juego a toda la app */}
        <GameProvider>
          <App />
        </GameProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);