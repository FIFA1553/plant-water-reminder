'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/src/lib/supabase/client'


type Plant = {
  id: string
  name: string
  species: string | null
  image_url: string | null
  watering_frequency_days: number
  last_watered: string
  next_watering: string
  daysLeft: number
  isOverdue: boolean
  isWatered: boolean
  showDetail?: boolean
}

const DAY_MS = 1000 * 60 * 60 * 24

export default function Dashboard() {
  /* ================= STATE ================= */
  const [plants, setPlants] = useState<Plant[]>([])
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: '',
    species: '',
    image_url: '',
    frequency: 7
  })

  /* ================= LOAD ================= */
  useEffect(() => {
    refreshAll()
  }, [])

  const refreshAll = async () => {
    await Promise.all([loadPlants(), loadLogs()])
    setLoading(false)
  }

  const loadPlants = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('plants')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    const today = new Date()

    const mapped = (data || []).map(p => {
      const next = new Date(p.next_watering)
      const daysLeft = Math.ceil(
        (next.getTime() - today.getTime()) / DAY_MS
      )

      return {
        ...p,
        daysLeft,
        isOverdue: daysLeft <= 0,
        isWatered: false,
        showDetail: false
      }
    })

    setPlants(mapped)
  }

  const loadLogs = async () => {
    const { data } = await supabase
      .from('watering_logs')
      .select('watered_at')

    setLogs(data || [])
  }

  /* ================= STATS ================= */
  const thirsty = plants.filter(p => p.isOverdue && !p.isWatered).length
  const healthy = plants.length - thirsty

  const wateredThisWeek = logs.filter(l => {
    const d = new Date(l.watered_at)
    return Date.now() - d.getTime() < 7 * DAY_MS
  }).length

  /* ================= ACTIONS ================= */
  const addPlant = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !form.name) return alert('Enter plant name')

    const today = new Date()
    const next = new Date()
    next.setDate(today.getDate() + form.frequency)

    const { data, error } = await supabase
      .from('plants')
      .insert({
        user_id: user.id,
        name: form.name,
        species: form.species,
        image_url: form.image_url,
        watering_frequency_days: form.frequency,
        last_watered: today.toISOString().slice(0, 10),
        next_watering: next.toISOString().slice(0, 10)
      })
      .select()
      .single()

    if (error) return alert(error.message)

    setPlants(prev => [{
      ...data,
      daysLeft: form.frequency,
      isOverdue: false,
      isWatered: false
    }, ...prev])

    setForm({ name: '', species: '', image_url: '', frequency: 7 })
    setShowForm(false)
  }

  const waterPlant = async (plant: Plant) => {
    const today = new Date()
    const next = new Date()
    next.setDate(today.getDate() + plant.watering_frequency_days)

    await supabase.from('plants').update({
      last_watered: today.toISOString().slice(0, 10),
      next_watering: next.toISOString().slice(0, 10)
    }).eq('id', plant.id)

    await supabase.from('watering_logs').insert({
      plant_id: plant.id,
      watered_at: today.toISOString()
    })

    refreshAll()
  }

  const deletePlant = async (id: string) => {
    if (!confirm('Delete this plant?')) return
    await supabase.from('watering_logs').delete().eq('plant_id', id)
    await supabase.from('plants').delete().eq('id', id)
    setPlants(prev => prev.filter(p => p.id !== id))
  }

  const toggleDetail = (id: string) => {
    setPlants(prev =>
      prev.map(p =>
        p.id === id ? { ...p, showDetail: !p.showDetail } : p
      )
    )
  }

  /* ================= UI ================= */
  if (loading) return <p className="loading">Loading...</p>

  return (
    <div className="app">

      {thirsty > 0 && (
        <div className="alert-bar">
          🔔 {thirsty} plants need water today
        </div>
      )}

      <header className="top-bar">
        <h2>🌱 My Garden</h2>
        <button onClick={() => setShowForm(true)}>＋</button>
      </header>

      <section className="stats">
        <div>
          <strong>{thirsty}</strong>
          <span>Thirsty</span>
        </div>
        <div>
          <strong>{healthy}</strong>
          <span>Healthy</span>
        </div>
        <div>
          <strong>{wateredThisWeek}</strong>
          <span>This week</span>
        </div>
      </section>

      {showForm && (
        <div className="modal">
          <div className="modal-box">
            <h3>Add Plant</h3>

            <input
              placeholder="Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
            <input
              placeholder="Species"
              value={form.species}
              onChange={e => setForm({ ...form, species: e.target.value })}
            />
            <input
              placeholder="Image URL"
              value={form.image_url}
              onChange={e => setForm({ ...form, image_url: e.target.value })}
            />
            <input
              type="number"
              value={form.frequency}
              onChange={e => setForm({ ...form, frequency: +e.target.value })}
            />

            <button onClick={addPlant}>Save</button>
            <button className="cancel" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <main className="plant-list">
        {plants.map(p => (
          <div className="plant-card" key={p.id}>
            {p.image_url && <img src={p.image_url} />}
            <h4>{p.name}</h4>
            <small>{p.species}</small>

            <p className={p.isOverdue ? 'overdue' : ''}>
              {p.isOverdue ? 'Needs water' : `${p.daysLeft} days left`}
            </p>

            {p.showDetail && (
              <div className="detail">
                <small>Last: {p.last_watered}</small>
                <small>Every {p.watering_frequency_days} days</small>
              </div>
            )}

            <div className="actions">
              <button onClick={() => waterPlant(p)}>💧</button>
              <button onClick={() => toggleDetail(p.id)}>👁</button>
              <button onClick={() => deletePlant(p.id)}>🗑</button>
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}
