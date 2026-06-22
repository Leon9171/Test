import React, { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import dataService from '../services/dataService'
import { Artikel as ArtikelType } from '../types'

function Artikel() {
  const [artikel, setArtikel] = useState<ArtikelType[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<ArtikelType>({
    id: '',
    name: '',
    beschreibung: '',
    preis: 0,
    einheit: '',
    kategorie: '',
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const data = await dataService.loadArtikle()
      setArtikel(data)
    } catch (error) {
      console.error('Error loading artikel:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!formData.name || !formData.preis) {
      alert('Bitte alle Felder ausfüllen')
      return
    }

    let updatedArtikel
    if (editingId) {
      updatedArtikel = artikel.map(a => a.id === editingId ? { ...formData, id: editingId } : a)
    } else {
      updatedArtikel = [...artikel, { ...formData, id: Date.now().toString() }]
    }

    const success = await dataService.saveArtikle(updatedArtikel)
    if (success) {
      setArtikel(updatedArtikel)
      setShowForm(false)
      setEditingId(null)
      setFormData({ id: '', name: '', beschreibung: '', preis: 0, einheit: '', kategorie: '' })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Wirklich löschen?')) return
    const updatedArtikel = artikel.filter(a => a.id !== id)
    const success = await dataService.saveArtikle(updatedArtikel)
    if (success) {
      setArtikel(updatedArtikel)
    }
  }

  const handleEdit = (a: ArtikelType) => {
    setFormData(a)
    setEditingId(a.id)
    setShowForm(true)
  }

  if (loading) return <div className="text-center py-12">Lädt...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Artikel</h1>
        <button
          onClick={() => {
            setShowForm(!showForm)
            if (showForm) {
              setEditingId(null)
              setFormData({ id: '', name: '', beschreibung: '', preis: 0, einheit: '', kategorie: '' })
            }
          }}
          className="bg-honey hover:bg-honeydark text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition"
        >
          <Plus className="w-5 h-5" /> Neuer Artikel
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">{editingId ? 'Artikel bearbeiten' : 'Neuer Artikel'}</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-honey"
            />
            <input
              type="text"
              placeholder="Beschreibung"
              value={formData.beschreibung}
              onChange={(e) => setFormData({ ...formData, beschreibung: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-honey"
            />
            <input
              type="number"
              placeholder="Preis"
              value={formData.preis}
              onChange={(e) => setFormData({ ...formData, preis: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-honey"
              step="0.01"
            />
            <input
              type="text"
              placeholder="Einheit (z.B. Stück, kg)"
              value={formData.einheit}
              onChange={(e) => setFormData({ ...formData, einheit: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-honey"
            />
            <input
              type="text"
              placeholder="Kategorie"
              value={formData.kategorie}
              onChange={(e) => setFormData({ ...formData, kategorie: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-honey"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex-1 bg-honey hover:bg-honeydark text-white font-bold py-2 px-4 rounded-lg transition"
              >
                Speichern
              </button>
              <button
                onClick={() => {
                  setShowForm(false)
                  setEditingId(null)
                  setFormData({ id: '', name: '', beschreibung: '', preis: 0, einheit: '', kategorie: '' })
                }}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded-lg transition"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-4">Name</th>
                <th className="text-left py-2 px-4">Beschreibung</th>
                <th className="text-left py-2 px-4">Preis</th>
                <th className="text-left py-2 px-4">Einheit</th>
                <th className="text-left py-2 px-4">Kategorie</th>
                <th className="text-center py-2 px-4">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {artikel.map(a => (
                <tr key={a.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{a.name}</td>
                  <td className="py-2 px-4">{a.beschreibung}</td>
                  <td className="py-2 px-4">€{a.preis.toFixed(2)}</td>
                  <td className="py-2 px-4">{a.einheit}</td>
                  <td className="py-2 px-4">{a.kategorie}</td>
                  <td className="py-2 px-4 text-center flex gap-2 justify-center">
                    <button
                      onClick={() => handleEdit(a)}
                      className="text-blue-500 hover:text-blue-700 transition"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(a.id)}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
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

export default Artikel
