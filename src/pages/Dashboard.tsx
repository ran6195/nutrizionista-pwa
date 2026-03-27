import { useMeals } from '../hooks/useMeals'
import { useProfile } from '../hooks/useProfile'
import { Link } from 'react-router-dom'

interface MacroBarProps {
  label: string
  current: number
  target: number
  color: string
  unit?: string
}

function MacroBar({ label, current, target, color, unit = 'g' }: MacroBarProps) {
  const pct = Math.min((current / target) * 100, 100)
  const over = current > target
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
        <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{label}</span>
        <span style={{ color: over ? 'var(--color-error)' : 'var(--color-text-muted)' }}>
          {Math.round(current)}/{target}{unit}
        </span>
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${pct}%`, background: over ? 'var(--color-error)' : color }}
        />
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { getTodayMeals } = useMeals()
  const { profile } = useProfile()
  const todayMeals = getTodayMeals()

  const totalCalories = todayMeals.reduce((s, m) => s + m.calories, 0)
  const totalProtein = todayMeals.reduce((s, m) => s + m.protein, 0)
  const totalCarbs = todayMeals.reduce((s, m) => s + m.carbs, 0)
  const totalFat = todayMeals.reduce((s, m) => s + m.fat, 0)

  const calPct = Math.min((totalCalories / profile.targetCalories) * 100, 100)
  const calOver = totalCalories > profile.targetCalories
  const remaining = Math.max(profile.targetCalories - totalCalories, 0)

  const today = new Date().toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })

  const goalLabels: Record<string, string> = {
    perdere_peso: '⚡ Perdita di peso',
    mantenere_peso: '⚖️ Mantenimento',
    aumentare_massa: '💪 Aumento massa',
  }

  return (
    <div className="page">
      <div>
        <h2 className="page-title">
          {profile.name ? `Ciao, ${profile.name}! 👋` : 'Buongiorno! 👋'}
        </h2>
        <p className="page-subtitle" style={{ textTransform: 'capitalize' }}>{today}</p>
      </div>

      {/* Calorie ring */}
      <div className="card" style={{ textAlign: 'center' }}>
        <p className="card-title">Calorie di oggi</p>
        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', margin: '8px 0' }}>
          <svg width="140" height="140" viewBox="0 0 140 140">
            <circle cx="70" cy="70" r="60" fill="none" stroke="var(--color-border)" strokeWidth="12" />
            <circle
              cx="70" cy="70" r="60"
              fill="none"
              stroke={calOver ? 'var(--color-error)' : 'var(--color-primary)'}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 60}`}
              strokeDashoffset={`${2 * Math.PI * 60 * (1 - calPct / 100)}`}
              transform="rotate(-90 70 70)"
              style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
          </svg>
          <div style={{ position: 'absolute', textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: calOver ? 'var(--color-error)' : 'var(--color-primary-dark)' }}>
              {Math.round(totalCalories)}
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>kcal</div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 8 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Obiettivo</div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{profile.targetCalories}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Rimanenti</div>
            <div style={{ fontWeight: 700, fontSize: 16, color: calOver ? 'var(--color-error)' : 'var(--color-success)' }}>
              {calOver ? `+${Math.round(totalCalories - profile.targetCalories)}` : remaining}
            </div>
          </div>
        </div>
      </div>

      {/* Macros */}
      <div className="card">
        <p className="card-title">Macronutrienti</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <MacroBar label="Proteine" current={totalProtein} target={profile.targetProtein} color="#3a9b64" />
          <MacroBar label="Carboidrati" current={totalCarbs} target={profile.targetCarbs} color="#f0a500" />
          <MacroBar label="Grassi" current={totalFat} target={profile.targetFat} color="#e07b39" />
        </div>
      </div>

      {/* Goal */}
      <div className="card" style={{ background: 'var(--color-primary)', color: '#fff' }}>
        <p style={{ fontSize: 12, fontWeight: 600, opacity: 0.75, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
          Il tuo obiettivo
        </p>
        <p style={{ fontSize: 18, fontWeight: 700 }}>
          {goalLabels[profile.goal] || '⚖️ Mantenimento'}
        </p>
        <p style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>
          {profile.targetCalories} kcal/giorno · {profile.targetProtein}g proteine
        </p>
      </div>

      {/* Today meals summary */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <p className="card-title" style={{ marginBottom: 0 }}>Pasti di oggi</p>
          <Link to="/pasti" className="btn btn-secondary btn-sm">+ Aggiungi</Link>
        </div>
        {todayMeals.length === 0 ? (
          <div className="empty-state" style={{ padding: '20px 0' }}>
            <div className="empty-state-emoji">🍽️</div>
            <p className="empty-state-text">Nessun pasto registrato oggi</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {todayMeals.slice(0, 3).map((meal) => (
              <div key={meal.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--color-border)' }}>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 14 }}>{meal.name}</p>
                  <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{meal.time} · {meal.category}</p>
                </div>
                <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{meal.calories} kcal</span>
              </div>
            ))}
            {todayMeals.length > 3 && (
              <Link to="/pasti" style={{ fontSize: 13, color: 'var(--color-primary)', textDecoration: 'none', textAlign: 'center', paddingTop: 4 }}>
                Vedi tutti ({todayMeals.length})
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Quick links */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Link to="/ai" className="card" style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
          <div style={{ fontSize: 28, marginBottom: 6 }}>🤖</div>
          <p style={{ fontWeight: 600, fontSize: 14 }}>Suggerimenti AI</p>
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Consigli personalizzati</p>
        </Link>
        <Link to="/nutrizionista" className="card" style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
          <div style={{ fontSize: 28, marginBottom: 6 }}>👨‍⚕️</div>
          <p style={{ fontWeight: 600, fontSize: 14 }}>Nutrizionista</p>
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Linee guida professionali</p>
        </Link>
      </div>
    </div>
  )
}
