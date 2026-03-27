import { useState } from 'react'
import { useProfile } from '../hooks/useProfile'
import type { UserProfile } from '../types'

const GOAL_OPTIONS = [
  { value: 'perdere_peso', label: '⚡ Perdere peso', description: 'Riduzione del peso corporeo' },
  { value: 'mantenere_peso', label: '⚖️ Mantenere il peso', description: 'Stabilizzazione del peso attuale' },
  { value: 'aumentare_massa', label: '💪 Aumentare la massa', description: 'Costruzione muscolare' },
]

const ACTIVITY_OPTIONS = [
  { value: 'sedentario', label: 'Sedentario', description: 'Poco o nessun esercizio', factor: 1.2 },
  { value: 'leggero', label: 'Leggero', description: 'Esercizio 1-3 giorni/settimana', factor: 1.375 },
  { value: 'moderato', label: 'Moderato', description: 'Esercizio 3-5 giorni/settimana', factor: 1.55 },
  { value: 'attivo', label: 'Attivo', description: 'Esercizio intenso 6-7 giorni/settimana', factor: 1.725 },
  { value: 'molto_attivo', label: 'Molto attivo', description: 'Esercizio molto intenso + lavoro fisico', factor: 1.9 },
]

function calculateTDEE(profile: UserProfile): { calories: number; protein: number; carbs: number; fat: number } {
  // Mifflin-St Jeor equation (assumed male for simplicity; in production would ask gender)
  const bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5
  const activityFactor = ACTIVITY_OPTIONS.find((a) => a.value === profile.activityLevel)?.factor || 1.55
  let calories = Math.round(bmr * activityFactor)

  if (profile.goal === 'perdere_peso') calories = Math.max(calories - 500, 1200)
  if (profile.goal === 'aumentare_massa') calories += 300

  const protein = Math.round(profile.weight * 1.6)
  const fat = Math.round((calories * 0.25) / 9)
  const carbs = Math.round((calories - protein * 4 - fat * 9) / 4)

  return { calories, protein, carbs, fat }
}

export default function Profile() {
  const { profile, updateProfile } = useProfile()
  const [saved, setSaved] = useState(false)
  const [localProfile, setLocalProfile] = useState({ ...profile })

  const macros = calculateTDEE(localProfile)

  const handleSave = () => {
    const computed = calculateTDEE(localProfile)
    updateProfile({
      ...localProfile,
      targetCalories: computed.calories,
      targetProtein: computed.protein,
      targetCarbs: computed.carbs,
      targetFat: computed.fat,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleChange = (field: keyof UserProfile, value: string | number) => {
    setLocalProfile((prev) => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  const bmi = localProfile.weight / Math.pow(localProfile.height / 100, 2)
  const bmiCategory =
    bmi < 18.5 ? 'Sottopeso' :
    bmi < 25 ? 'Normopeso' :
    bmi < 30 ? 'Sovrappeso' : 'Obesità'
  const bmiColor =
    bmi < 18.5 ? '#f0a500' :
    bmi < 25 ? '#2d7a4f' :
    bmi < 30 ? '#dd6b20' : '#e53e3e'

  return (
    <div className="page">
      <div>
        <h2 className="page-title">Il mio profilo</h2>
        <p className="page-subtitle">Personalizza il tuo piano nutrizionale</p>
      </div>

      {/* BMI Card */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 28, fontWeight: 700, color: bmiColor }}>{bmi.toFixed(1)}</p>
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>BMI</p>
          <p style={{ fontSize: 11, fontWeight: 600, color: bmiColor, marginTop: 2 }}>{bmiCategory}</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 28, fontWeight: 700, color: 'var(--color-primary)' }}>{macros.calories}</p>
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>kcal/giorno</p>
          <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', marginTop: 2 }}>Fabbisogno calcolato</p>
        </div>
      </div>

      {/* Personal info */}
      <div className="card">
        <p className="card-title">Informazioni personali</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="form-group">
            <label className="form-label">Nome</label>
            <input
              className="form-input"
              type="text"
              placeholder="Il tuo nome"
              value={localProfile.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Età (anni)</label>
              <input
                className="form-input"
                type="number"
                min={10}
                max={100}
                value={localProfile.age}
                onChange={(e) => handleChange('age', Number(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Peso (kg)</label>
              <input
                className="form-input"
                type="number"
                min={30}
                max={300}
                step={0.1}
                value={localProfile.weight}
                onChange={(e) => handleChange('weight', Number(e.target.value))}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Altezza (cm)</label>
            <input
              className="form-input"
              type="number"
              min={100}
              max={250}
              value={localProfile.height}
              onChange={(e) => handleChange('height', Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      {/* Goal */}
      <div className="card">
        <p className="card-title">Obiettivo</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {GOAL_OPTIONS.map((goal) => (
            <label
              key={goal.value}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                border: '1.5px solid',
                borderColor: localProfile.goal === goal.value ? 'var(--color-primary)' : 'var(--color-border)',
                background: localProfile.goal === goal.value ? 'rgba(45,122,79,0.06)' : 'transparent',
                cursor: 'pointer',
              }}
            >
              <input
                type="radio"
                name="goal"
                value={goal.value}
                checked={localProfile.goal === goal.value}
                onChange={() => handleChange('goal', goal.value)}
                style={{ accentColor: 'var(--color-primary)' }}
              />
              <div>
                <p style={{ fontWeight: 600, fontSize: 14 }}>{goal.label}</p>
                <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{goal.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Activity Level */}
      <div className="card">
        <p className="card-title">Livello di attività fisica</p>
        <select
          className="form-select"
          value={localProfile.activityLevel}
          onChange={(e) => handleChange('activityLevel', e.target.value)}
        >
          {ACTIVITY_OPTIONS.map((act) => (
            <option key={act.value} value={act.value}>
              {act.label} — {act.description}
            </option>
          ))}
        </select>
      </div>

      {/* Macro targets preview */}
      <div className="card">
        <p className="card-title">Fabbisogno calcolato</p>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 12 }}>
          Basato sulla formula Mifflin-St Jeor e il tuo livello di attività
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { label: 'Calorie', value: `${macros.calories} kcal`, color: 'var(--color-primary)' },
            { label: 'Proteine', value: `${macros.protein}g`, color: '#3a9b64' },
            { label: 'Carboidrati', value: `${macros.carbs}g`, color: '#f0a500' },
            { label: 'Grassi', value: `${macros.fat}g`, color: '#e07b39' },
          ].map((m) => (
            <div key={m.label} style={{ background: 'var(--color-surface-alt)', borderRadius: 'var(--radius-sm)', padding: '10px 12px' }}>
              <p style={{ fontSize: 18, fontWeight: 700, color: m.color }}>{m.value}</p>
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{m.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Save button */}
      <button
        className="btn btn-primary btn-full"
        onClick={handleSave}
        style={{ fontSize: 16, padding: '14px' }}
      >
        {saved ? '✅ Salvato!' : '💾 Salva profilo'}
      </button>

      {/* Info */}
      <div className="card" style={{ background: 'var(--color-surface-alt)', border: '1px dashed var(--color-border)' }}>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
          🔒 I tuoi dati sono salvati solo sul tuo dispositivo e non vengono condivisi con nessuno.
        </p>
      </div>
    </div>
  )
}
