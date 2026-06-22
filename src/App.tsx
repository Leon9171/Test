import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import githubService from './services/githubService'
import Dashboard from './pages/Dashboard'
import Warenbestand from './pages/Warenbestand'
import Auftraege from './pages/Auftraege'
import Artikel from './pages/Artikel'
import Einstellungen from './pages/Einstellungen'
import { Beehive } from 'lucide-react'

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('github_token') || '')
  const [isConnected, setIsConnected] = useState(!!token)

  useEffect(() => {
    if (token) {
      githubService.setToken(token)
      setIsConnected(true)
      localStorage.setItem('github_token', token)
    }
  }, [token])

  return (
    <Router basename="/Test">
      <div className="min-h-screen bg-gray-50">
        {!isConnected ? (
          <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-yellow-400 to-yellow-500">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
              <div className="flex justify-center mb-6">
                <Beehive className="w-16 h-16 text-yellow-500" />
              </div>
              <h1 className="text-3xl font-bold text-center mb-2">Imkerei ERP</h1>
              <p className="text-center text-gray-600 mb-6">Geben Sie Ihren GitHub Token ein</p>
              <input
                type="password"
                placeholder="GitHub Personal Access Token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-yellow-500"
              />
              <button
                onClick={() => setIsConnected(!!token)}
                disabled={!token}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Verbinden
              </button>
              <p className="text-xs text-gray-500 mt-4 text-center">
                Token wird nur lokal gespeichert und nicht an Server übertragen
              </p>
            </div>
          </div>
        ) : (
          <>
            <nav className="bg-yellow-500 shadow-lg">
              <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <Beehive className="w-8 h-8 text-white" />
                  <span className="font-bold text-white text-xl">Imkerei ERP</span>
                </div>
                <div className="flex gap-6 flex-1">
                  <Link to="/" className="text-white hover:bg-yellow-600 px-3 py-2 rounded transition">
                    Dashboard
                  </Link>
                  <Link to="/artikel" className="text-white hover:bg-yellow-600 px-3 py-2 rounded transition">
                    Artikel
                  </Link>
                  <Link to="/bestand" className="text-white hover:bg-yellow-600 px-3 py-2 rounded transition">
                    Warenbestand
                  </Link>
                  <Link to="/auftraege" className="text-white hover:bg-yellow-600 px-3 py-2 rounded transition">
                    Aufträge
                  </Link>
                  <Link to="/einstellungen" className="text-white hover:bg-yellow-600 px-3 py-2 rounded transition ml-auto">
                    Einstellungen
                  </Link>
                </div>
              </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/artikel" element={<Artikel />} />
                <Route path="/bestand" element={<Warenbestand />} />
                <Route path="/auftraege" element={<Auftraege />} />
                <Route path="/einstellungen" element={<Einstellungen />} />
              </Routes>
            </main>
          </>
        )}
      </div>
    </Router>
  )
}

export default App
