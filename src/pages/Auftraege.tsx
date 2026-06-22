import React, { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import dataService from '../services/dataService'
import { Auftrag, Artikel as ArtikelType, AuftragPosition } from '../types'

function Auftraege() {
  const [auftraege, setAuftraege] = useState<Auftrag[]>([])
  const [artikel, setArtikel] = useState<ArtikelType[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Auftrag>({
    id: '',
    auftragsnummer: '',
    kunde: '',
    datum: new Date().toISOString().split('T')[0],
    status: 'offen',
    positionen: [],
    gesamtbetrag: 0,
    notizen: '',
  })
  const [selectedArtikle, setSelectedArtikle] = useState<string>('')
  const [selectedMenge, setSelectedMenge] = useState<number>(1)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const auftraege = await dataService.loadAuftraege()
      const artikel = await dataService.loadArtikle()
      setAuftraege(auftraege)
      setArtikel(artikel)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const addPosition = () => {
    if (!selectedArtikle) return
    const art = artikel.find(a => a.id === selectedArtikle)
    if (!art) return

    const position: AuftragPosition = {
      artikel_id: selectedArtikle,
      menge: selectedMenge,
      einzelpreis: art.preis,
      gesamtpreis: art.preis * selectedMenge,
    }

    const updatedPositionen = [...formData.positionen, position]
    const gesamtbetrag = updatedPositionen.reduce((sum, p) => sum + p.gesamtpreis, 0)

    setFormData({
      ...formData,
      positionen: updatedPositionen,
      gesamtbetrag,
    })
    setSelectedArtikle('')
    setSelectedMenge(1)
  }

  const removePosition = (index: number) => {
    const updatedPositionen = formData.positionen.filter((_, i) => i !== index)
    const gesamtbetrag = updatedPositionen.reduce((sum, p) => sum + p.gesamtpreis, 0)
    setFormData({
      ...formData,
      positionen: updatedPositionen,
      gesamtbetrag,
    })
  }

  const handleSave = async () => {
    if (!formData.auftragsnummer || !formData.kunde || formData.positionen.length === 0) {
      alert('Bitte alle Felder ausfüllen')
      return
    }

    let updatedAuftraege
    if (editingId) {
      updatedAuftraege = auftraege.map(a => a.id === editingId ? { ...formData, id: editingId } : a)
    } else {
      updatedAuftraege = [...auftraege, { ...formData, id: Date.now().toString() }]
    }

    const success = await dataService.saveAuftraege(updatedAuftraege)
    if (success) {
      setAuftraege(updatedAuftraege)
      setShowForm(false)
      setEditingId(null)
      setFormData({
        id: '',
        auftragsnummer: '',
        kunde: '',
        datum: new Date().toISOString().split('T')[0],
        status: 'offen',
        positionen: [],
        gesamtbetrag: 0,
        notizen: '',
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Wirklich löschen?')) return
    const updatedAuftraege = auftraege.filter(a => a.id !== id)
    const success = await dataService.saveAuftraege(updatedAuftraege)
    if (success) {
      setAuftraege(updatedAuftraege)
    }
  }

  const handleEdit = (a: Auftrag) => {
    setFormData(a)
    setEditingId(a.id)
    setShowForm(true)
  }

  const getArtikelName = (id: string) => artikel.find(a => a.id === id)?.name || 'Unbekannt'

  if (loading) return <div className="text-center py-12">Lädt...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Aufträge</h1>
        <button
          onClick={() => {
            setShowForm(!showForm)
            if (showForm) {
              setEditingId(null)
              setFormData({
                id: '',
                auftragsnummer: '',
                kunde: '',
                datum: new Date().toISOString().split('T')[0],
                status: 'offen',
                positionen: [],
                gesamtbetrag: 0,
                notizen: '',
              })
            }
          }}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition"
        >
          <Plus className="w-5 h-5" /> Neuer Auftrag
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">{editingId ? 'Auftrag bearbeiten' : 'Neuer Auftrag'}</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Auftragsnummer"
                value={formData.auftragsnummer}
                onChange={(e) => setFormData({ ...formData, auftragsnummer: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500"
              />
              <input
                type="text"
                placeholder="Kundenname"
                value={formData.kunde}
                onChange={(e) => setFormData({ ...formData, kunde: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500"
              />
              <input
                type="date"
                value={formData.datum}
                onChange={(e) => setFormData({ ...formData, datum: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500"
              />
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500"
              >
                <option value="offen">Offen</option>
                <option value="in_bearbeitung">In Bearbeitung</option>
                <option value="abgeschlossen">Abgeschlossen</option>
                <option value="storniert">Storniert</option>
              </select>
            </div>

            <textarea
              placeholder="Notizen"
              value={formData.notizen}
              onChange={(e) => setFormData({ ...formData, notizen: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500 h-24"
            />

            <div className="border-t pt-4">
              <h3 className="font-bold mb-2">Positionen</h3>
              <div className="flex gap-2 mb-4">
                <select
                  value={selectedArtikle}
                  onChange={(e) => setSelectedArtikle(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Artikel auswählen</option>
                  {artikel.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.name} - €{a.preis}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={selectedMenge}
                  onChange={(e) => setSelectedMenge(parseInt(e.target.value))}
                  min="1"
                  className="w-20 px-4 py-2 border border-gray-300 rounded-lg"
                />
                <button
                  onClick={addPosition}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
                >
                  Hinzufügen
                </button>
              </div>

              {formData.positionen.length > 0 && (
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2">Artikel</th>
                      <th className="text-center py-2 px-2">Menge</th>
                      <th className="text-right py-2 px-2">Preis</th>
                      <th className="text-right py-2 px-2">Gesamt</th>
                      <th className="text-center py-2 px-2">Aktion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.positionen.map((p, i) => (
                      <tr key={i} className="border-b">
                        <td className="py-2 px-2">{getArtikelName(p.artikel_id)}</td>
                        <td className="text-center py-2 px-2">{p.menge}</td>
                        <td className="text-right py-2 px-2">€{p.einzelpreis.toFixed(2)}</td>
                        <td className="text-right py-2 px-2">€{p.gesamtpreis.toFixed(2)}</td>
                        <td className="text-center py-2 px-2">
                          <button
                            onClick={() => removePosition(i)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Löschen
                          </button>
                        </td>
                      </tr>
                    ))}
                    <tr className="font-bold">
                      <td colSpan={3} className="text-right py-2 px-2">Gesamtbetrag:</td>
                      <td className="text-right py-2 px-2">€{formData.gesamtbetrag.toFixed(2)}</td>
                      <td />
                    </tr>
                  </tbody>
                </table>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg transition"
              >
                Speichern
              </button>
              <button
                onClick={() => {
                  setShowForm(false)
                  setEditingId(null)
                  setFormData({
                    id: '',
                    auftragsnummer: '',
                    kunde: '',
                    datum: new Date().toISOString().split('T')[0],
                    status: 'offen',
                    positionen: [],
                    gesamtbetrag: 0,
                    notizen: '',
                  })
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
                <th className="text-left py-2 px-4">Auftragsnummer</th>
                <th className="text-left py-2 px-4">Kunde</th>
                <th className="text-left py-2 px-4">Datum</th>
                <th className="text-left py-2 px-4">Status</th>
                <th className="text-right py-2 px-4">Gesamtbetrag</th>
                <th className="text-center py-2 px-4">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {auftraege.map(a => (
                <tr key={a.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{a.auftragsnummer}</td>
                  <td className="py-2 px-4">{a.kunde}</td>
                  <td className="py-2 px-4">{new Date(a.datum).toLocaleDateString('de-DE')}</td>
                  <td className="py-2 px-4">
                    <span className={`px-2 py-1 rounded text-sm font-bold ${
                      a.status === 'offen' ? 'bg-red-100 text-red-800' :
                      a.status === 'in_bearbeitung' ? 'bg-yellow-100 text-yellow-800' :
                      a.status === 'abgeschlossen' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="text-right py-2 px-4">€{a.gesamtbetrag.toFixed(2)}</td>
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

export default Auftraege
