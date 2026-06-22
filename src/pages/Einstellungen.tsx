import React, { useState } from 'react'
import { LogOut } from 'lucide-react'

function Einstellungen() {
  const [showLogout, setShowLogout] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('github_token')
    window.location.reload()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Einstellungen</h1>

      <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl">
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold mb-2">GitHub-Verbindung</h2>
            <p className="text-gray-600 mb-4">
              Deine Anwendung ist mit GitHub verbunden. Alle Daten werden in deinem Repository gespeichert.
            </p>

            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <h3 className="font-bold text-blue-900 mb-2">📋 Hilfreiche Informationen:</h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>✓ Repository: <code className="bg-white px-2 py-1 rounded">Leon9171/Test</code></li>
                <li>✓ Branch: <code className="bg-white px-2 py-1 rounded">imkerei-erp-data</code></li>
                <li>✓ Datenformat: CSV-Dateien</li>
              </ul>
            </div>

            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <h3 className="font-bold text-green-900 mb-2">🔒 Sicherheit:</h3>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Dein Token wird nur lokal gespeichert</li>
                <li>• Keine Daten werden an externe Server gesendet</li>
                <li>• Du kannst deinen Token jederzeit widerrufen</li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-4">
            <h2 className="text-xl font-bold mb-4">Abmelden</h2>
            <button
              onClick={() => setShowLogout(true)}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition"
            >
              <LogOut className="w-5 h-5" /> Abmelden
            </button>
          </div>
        </div>
      </div>

      {showLogout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
            <h2 className="text-xl font-bold mb-4">Abmelden?</h2>
            <p className="text-gray-600 mb-6">
              Du wirst abgemeldet. Deine Daten bleiben im Repository erhalten.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleLogout}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition"
              >
                Ja, abmelden
              </button>
              <button
                onClick={() => setShowLogout(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded-lg transition"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Einstellungen
