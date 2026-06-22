import React, { useState, useEffect } from 'react'
import { TrendingUp, Package, ShoppingCart, DollarSign } from 'lucide-react'
import dataService from '../services/dataService'
import { Statistiken, Auftrag } from '../types'

function Dashboard() {
  const [stats, setStats] = useState<Statistiken>({
    gesamtumsatz: 0,
    offeneAuftraege: 0,
    gesamtbestand: 0,
    bestandswert: 0,
  })
  const [auftraege, setAuftraege] = useState<Auftrag[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const stats = await dataService.getStatistiken()
      setStats(stats)
      const auftraege = await dataService.loadAuftraege()
      setAuftraege(auftraege.filter(a => a.status === 'offen' || a.status === 'in_bearbeitung').slice(0, 5))
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ icon: Icon, label, value, color }: any) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{label}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <Icon className={`w-10 h-10 ${color}`} />
      </div>
    </div>
  )

  if (loading) {
    return <div className="text-center py-12">Lädt...</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={DollarSign}
          label="Gesamtumsatz"
          value={`€${stats.gesamtumsatz.toFixed(2)}`}
          color="text-yellow-500"
        />
        <StatCard
          icon={ShoppingCart}
          label="Offene Aufträge"
          value={stats.offeneAuftraege}
          color="text-blue-500"
        />
        <StatCard
          icon={Package}
          label="Gesamtbestand"
          value={`${stats.gesamtbestand} Einheiten`}
          color="text-green-500"
        />
        <StatCard
          icon={TrendingUp}
          label="Bestandswert"
          value={`€${stats.bestandswert.toFixed(2)}`}
          color="text-purple-500"
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Offene Aufträge</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-4">Auftragsnummer</th>
                <th className="text-left py-2 px-4">Kunde</th>
                <th className="text-left py-2 px-4">Datum</th>
                <th className="text-left py-2 px-4">Status</th>
                <th className="text-right py-2 px-4">Gesamtbetrag</th>
              </tr>
            </thead>
            <tbody>
              {auftraege.length > 0 ? (
                auftraege.map(a => (
                  <tr key={a.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{a.auftragsnummer}</td>
                    <td className="py-2 px-4">{a.kunde}</td>
                    <td className="py-2 px-4">{new Date(a.datum).toLocaleDateString('de-DE')}</td>
                    <td className="py-2 px-4">
                      <span className={`px-2 py-1 rounded text-sm font-bold ${
                        a.status === 'offen' ? 'bg-red-100 text-red-800' :
                        a.status === 'in_bearbeitung' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="text-right py-2 px-4">€{a.gesamtbetrag.toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    Keine offenen Aufträge
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
