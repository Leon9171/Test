import React, { useState, useEffect } from 'react'
import { Edit2 } from 'lucide-react'
import dataService from '../services/dataService'
import { Bestand, Artikel as ArtikelType } from '../types'

function Warenbestand() {
  const [bestaende, setBestaende] = useState<Bestand[]>([])
  const [artikel, setArtikel] = useState<ArtikelType[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editMenge, setEditMenge] = useState<number>(0)
  const [editLagerort, setEditLagerort] = useState<string>('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const bestaende = await dataService.loadBestand()
      const artikel = await dataService.loadArtikle()
      setBestaende(bestaende)
      setArtikel(artikel)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (artikel_id: string) => {
    const updated = bestaende.map(b =>
      b.artikel_id === artikel_id
        ? { ...b, menge: editMenge, lagerort: editLagerort, zuletzt_aktualisiert: new Date().toISOString() }
        : b
    )
    const success = await dataService.saveBestand(updated)
    if (success) {
      setBestaende(updated)
      setEditingId(null)
    }
  }

  const getArtikelName = (id: string) => {
    return artikel.find(a => a.id === id)?.name || 'Unbekannt'
  }

  const getArtikelPreis = (id: string) => {
    return artikel.find(a => a.id === id)?.preis || 0
  }

  if (loading) return <div className="text-center py-12">Lädt...</div>

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Warenbestand</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <p className="text-gray-500">Gesamtbestand</p>
            <p className="text-2xl font-bold">{bestaende.reduce((s, b) => s + b.menge, 0)} Einheiten</p>
          </div>
          <div>
            <p className="text-gray-500">Bestandswert</p>
            <p className="text-2xl font-bold">€{bestaende.reduce((s, b) => s + (b.menge * getArtikelPreis(b.artikel_id)), 0).toFixed(2)}</p>
          </div>
          <div>
            <p className="text-gray-500">Artikel</p>
            <p className="text-2xl font-bold">{bestaende.length}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-4">Artikel</th>
                <th className="text-left py-2 px-4">Menge</th>
                <th className="text-left py-2 px-4">Lagerort</th>
                <th className="text-left py-2 px-4">Wert</th>
                <th className="text-center py-2 px-4">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {bestaende.map(b => (
                <tr key={b.artikel_id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{getArtikelName(b.artikel_id)}</td>
                  <td className="py-2 px-4">
                    {editingId === b.artikel_id ? (
                      <input
                        type="number"
                        value={editMenge}
                        onChange={(e) => setEditMenge(parseInt(e.target.value))}
                        className="px-2 py-1 border border-gray-300 rounded w-20"
                      />
                    ) : (
                      b.menge
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {editingId === b.artikel_id ? (
                      <input
                        type="text"
                        value={editLagerort}
                        onChange={(e) => setEditLagerort(e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded"
                      />
                    ) : (
                      b.lagerort
                    )}
                  </td>
                  <td className="py-2 px-4">€{(b.menge * getArtikelPreis(b.artikel_id)).toFixed(2)}</td>
                  <td className="py-2 px-4 text-center">
                    {editingId === b.artikel_id ? (
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleSave(b.artikel_id)}
                          className="bg-yellow-500 text-white px-2 py-1 rounded text-sm"
                        >
                          Speichern
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="bg-gray-300 text-black px-2 py-1 rounded text-sm"
                        >
                          Abbrechen
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingId(b.artikel_id)
                          setEditMenge(b.menge)
                          setEditLagerort(b.lagerort)
                        }}
                        className="text-blue-500 hover:text-blue-700 transition"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Warenbestand
