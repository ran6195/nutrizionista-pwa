import { useState } from 'react'
import { useMeals } from '../hooks/useMeals'
import type { Meal } from '../types'

const CATEGORY_ICONS: Record<string, string> = {
  colazione: '🌅',
  pranzo: '☀️',
  cena: '🌙',
  spuntino: '🍎',
}

const COMMON_FOODS = [
  { name: 'Pasta al pomodoro', calories: 350, protein: 12, carbs: 65, fat: 5, category: 'pranzo' as const },
  { name: 'Petto di pollo', calories: 165, protein: 31, carbs: 0, fat: 3.6, category: 'pranzo' as const },
  { name: 'Insalata mista', calories: 50, protein: 2, carbs: 8, fat: 0.5, category: 'pranzo' as const },
  { name: 'Uova strapazzate (2)', calories: 180, protein: 13, carbs: 1, fat: 13, category: 'colazione' as const },
  { name: 'Yogurt greco', calories: 100, protein: 10, carbs: 6, fat: 3, category: 'spuntino' as const },
  { name: 'Banana', calories: 89, protein: 1, carbs: 23, fat: 0.3, category: 'spuntino' as const },
  { name: 'Salmone al forno', calories: 208, protein: 28, carbs: 0, fat: 10, category: 'cena' as const },
  { name: 'Riso integrale', calories: 220, protein: 5, carbs: 46, fat: 2, category: 'pranzo' as const },
  { name: 'Caffè con latte', calories: 60, protein: 3, carbs: 6, fat: 2, category: 'colazione' as const },
  { name: 'Mela', calories: 52, protein: 0.3, carbs: 14, fat: 0.2, category: 'spuntino' as const },
]

interface FormState {
  name: string
  calories: string
  protein: string
  carbs: string
  fat: string
  time: string
  category: Meal['category']
}

const emptyForm = (): FormState => ({
  name: '',
  calories: '',
  protein: '',
  carbs: '',
  fat: '',
  time: new Date().toTimeString().slice(0, 5),
  category: 'pranzo',
})

export default function MealLog() {
  const { meals, addMeal, removeMeal, getTodayMeals } = useMeals()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [viewDate, setViewDate] = useState(new Date().toISOString().split('T')[0])
  const [filter, setFilter] = useState<'today' | 'all'>('today')

  const todayMeals = getTodayMeals()
  const allMeals = filter === 'today' ? todayMeals : meals

  const handleQuickAdd = (food: typeof COMMON_FOODS[0]) => {
    setForm({
      name: food.name,
      calories: String(food.calories),
      protein: String(food.protein),
      carbs: String(food.carbs),
      fat: String(food.fat),
      time: new Date().toTimeString().slice(0, 5),
      category: food.category,
    })
    setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.calories) return
    addMeal({
      name: form.name,
      calories: Number(form.calories),
      protein: Number(form.protein) || 0,
      carbs: Number(form.carbs) || 0,
      fat: Number(form.fat) || 0,
      time: form.time,
      date: viewDate,
      category: form.category,
    })
    setForm(emptyForm())
    setShowForm(false)
  }

  const totalCals = allMeals.reduce((s, m) => s + m.calories, 0)

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 className="page-title">Diario Alimentare</h2>
          <p className="page-subtitle">Registra i tuoi pasti</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Chiudi' : '+ Aggiungi'}
        </button>
      </div>

      {/* Add Meal Form */}
      {showForm && (
        <div className="card" style={{ border: '2px solid var(--color-primary)' }}>
          <p className="card-title">Nuovo pasto</p>

          {/* Quick add */}
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 8 }}>
              AGGIUNGI VELOCE
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {COMMON_FOODS.map((f) => (
                <button
                  key={f.name}
                  type="button"
                  onClick={() => handleQuickAdd(f)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 20,
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-surface-alt)',
                    fontSize: 12,
                    cursor: 'pointer',
                    color: 'var(--color-text)',
                  }}
                >
                  {f.name}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Nome alimento *</label>
              <input
                className="form-input"
                type="text"
                required
                placeholder="es. Pasta al pomodoro"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Calorie (kcal) *</label>
                <input
                  className="form-input"
                  type="number"
                  min={0}
                  required
                  placeholder="350"
                  value={form.calories}
                  onChange={(e) => setForm({ ...form, calories: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Categoria</label>
                <select
                  className="form-select"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as Meal['category'] })}
                >
                  <option value="colazione">🌅 Colazione</option>
                  <option value="pranzo">☀️ Pranzo</option>
                  <option value="cena">🌙 Cena</option>
                  <option value="spuntino">🍎 Spuntino</option>
                </select>
              </div>
            </div>
            <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
              <div className="form-group">
                <label className="form-label">Proteine (g)</label>
                <input
                  className="form-input"
                  type="number"
                  min={0}
                  placeholder="0"
                  value={form.protein}
                  onChange={(e) => setForm({ ...form, protein: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Carbo (g)</label>
                <input
                  className="form-input"
                  type="number"
                  min={0}
                  placeholder="0"
                  value={form.carbs}
                  onChange={(e) => setForm({ ...form, carbs: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Grassi (g)</label>
                <input
                  className="form-input"
                  type="number"
                  min={0}
                  placeholder="0"
                  value={form.fat}
                  onChange={(e) => setForm({ ...form, fat: e.target.value })}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Orario</label>
                <input
                  className="form-input"
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Data</label>
                <input
                  className="form-input"
                  type="date"
                  value={viewDate}
                  onChange={(e) => setViewDate(e.target.value)}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" className="btn btn-primary btn-full">Salva pasto</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Annulla</button>
            </div>
          </form>
        </div>
      )}

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          className={`btn btn-sm ${filter === 'today' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilter('today')}
        >
          Oggi
        </button>
        <button
          className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilter('all')}
        >
          Tutti ({meals.length})
        </button>
      </div>

      {/* Summary */}
      {allMeals.length > 0 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <div className="card" style={{ flex: '1 1 120px', textAlign: 'center', padding: '12px' }}>
            <p style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-primary)' }}>{Math.round(totalCals)}</p>
            <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>kcal totali</p>
          </div>
          <div className="card" style={{ flex: '1 1 120px', textAlign: 'center', padding: '12px' }}>
            <p style={{ fontSize: 22, fontWeight: 700, color: '#3a9b64' }}>
              {Math.round(allMeals.reduce((s, m) => s + m.protein, 0))}g
            </p>
            <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>proteine</p>
          </div>
          <div className="card" style={{ flex: '1 1 120px', textAlign: 'center', padding: '12px' }}>
            <p style={{ fontSize: 22, fontWeight: 700, color: '#f0a500' }}>
              {Math.round(allMeals.reduce((s, m) => s + m.carbs, 0))}g
            </p>
            <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>carboidrati</p>
          </div>
        </div>
      )}

      {/* Meals list */}
      <div className="card">
        <p className="card-title">{filter === 'today' ? 'Pasti di oggi' : 'Tutti i pasti'}</p>
        {allMeals.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-emoji">🍽️</div>
            <p className="empty-state-text">Nessun pasto registrato</p>
            <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={() => setShowForm(true)}>
              Aggiungi il tuo primo pasto
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {allMeals.map((meal) => (
              <div
                key={meal.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 0',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 20 }}>{CATEGORY_ICONS[meal.category]}</span>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 14 }}>{meal.name}</p>
                    <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                      {meal.date !== new Date().toISOString().split('T')[0] ? `${meal.date} · ` : ''}{meal.time}
                    </p>
                    <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                      P:{Math.round(meal.protein)}g · C:{Math.round(meal.carbs)}g · G:{Math.round(meal.fat)}g
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: 15 }}>
                    {meal.calories} kcal
                  </span>
                  <button
                    onClick={() => removeMeal(meal.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 16,
                      color: 'var(--color-text-muted)',
                      padding: '4px',
                    }}
                    aria-label={`Rimuovi ${meal.name}`}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
