import { useState } from 'react'
import { useProfile } from '../hooks/useProfile'
import { useMeals } from '../hooks/useMeals'
import type { AiSuggestion } from '../types'

function generateSuggestions(profile: ReturnType<typeof useProfile>['profile'], totalCals: number, totalProtein: number): AiSuggestion[] {
  const suggestions: AiSuggestion[] = []
  const calRatio = totalCals / profile.targetCalories
  const proteinRatio = totalProtein / profile.targetProtein

  // Calorie-based suggestions
  if (calRatio < 0.5) {
    suggestions.push({
      id: 'cal-low',
      category: 'dieta',
      title: 'Calorie insufficienti oggi',
      description: 'Hai consumato meno della metà delle calorie raccomandate. Assicurati di mangiare abbastanza per mantenere energia e metabolismo attivi.',
      icon: '⚡',
    })
  } else if (calRatio > 1.15) {
    suggestions.push({
      id: 'cal-high',
      category: 'dieta',
      title: 'Calorie superate',
      description: 'Hai superato il tuo obiettivo calorico. Considera porzioni più piccole o alimenti a bassa densità calorica come verdure e frutta per i prossimi pasti.',
      icon: '📊',
    })
  } else if (calRatio >= 0.85 && calRatio <= 1.05) {
    suggestions.push({
      id: 'cal-good',
      category: 'motivazione',
      title: 'Ottimo equilibrio calorico! 🎉',
      description: "Stai rispettando perfettamente il tuo obiettivo calorico. Continua così!",
      icon: '🏆',
    })
  }

  // Protein suggestions
  if (proteinRatio < 0.7) {
    suggestions.push({
      id: 'protein-low',
      category: 'alimento',
      title: 'Aumenta le proteine',
      description: 'Le tue proteine sono basse. Aggiungi fonti proteiche come pollo, pesce, uova, legumi o yogurt greco ai tuoi pasti.',
      icon: '💪',
    })
  }

  // Goal-based suggestions
  if (profile.goal === 'perdere_peso') {
    suggestions.push({
      id: 'weight-loss-1',
      category: 'abitudine',
      title: 'Trucchi per la sazietà',
      description: 'Per ridurre la fame, inizia i pasti con una zuppa leggera o insalata. Mangia lentamente e assapora ogni boccone – ci vogliono 20 minuti perché lo stomaco segnali sazietà.',
      icon: '🥗',
    })
    suggestions.push({
      id: 'weight-loss-2',
      category: 'alimento',
      title: 'Alimenti consigliati per te',
      description: 'Verdure a foglia verde, legumi, proteine magre e cereali integrali ti aiutano a sentirti sazio con meno calorie. Limita zuccheri raffinati e cibi ultra-processati.',
      icon: '🥦',
    })
  } else if (profile.goal === 'aumentare_massa') {
    suggestions.push({
      id: 'muscle-1',
      category: 'dieta',
      title: 'Surplus calorico controllato',
      description: 'Per aumentare la massa muscolare, punta a un surplus di 200-300 kcal al giorno. Distribuisci le proteine in 4-5 pasti per ottimizzare la sintesi proteica.',
      icon: '🏋️',
    })
    suggestions.push({
      id: 'muscle-2',
      category: 'alimento',
      title: 'Pasto post-allenamento',
      description: 'Entro 30-60 minuti dall\'allenamento, consuma proteine + carboidrati. Ad esempio: yogurt greco con banana, o riso con pollo.',
      icon: '🥩',
    })
  } else {
    suggestions.push({
      id: 'maintain-1',
      category: 'abitudine',
      title: 'Varietà alimentare',
      description: 'Per il mantenimento del peso, punta alla varietà: 5 porzioni di frutta e verdura al giorno, cereali integrali, proteine variegate (carne, pesce, legumi) e grassi sani.',
      icon: '🌈',
    })
  }

  // Hydration suggestion
  suggestions.push({
    id: 'water',
    category: 'abitudine',
    title: 'Idratazione ottimale',
    description: `Con un peso di ${profile.weight}kg, dovresti bere circa ${Math.round(profile.weight * 0.033 * 10) / 10}L di acqua al giorno. L'idratazione è fondamentale per il metabolismo e la digestione.`,
    icon: '💧',
  })

  // Meal timing
  suggestions.push({
    id: 'timing',
    category: 'abitudine',
    title: 'Timing dei pasti',
    description: 'Distribuisci i pasti in modo regolare: colazione entro un\'ora dal risveglio, pranzo a metà giornata e cena almeno 2-3 ore prima di dormire per favorire la digestione.',
    icon: '⏰',
  })

  // Mediterranean diet suggestion
  suggestions.push({
    id: 'mediterranean',
    category: 'dieta',
    title: 'Dieta Mediterranea',
    description: 'La dieta mediterranea è scientificamente provata per salute cardiovascolare e longevità: abbondante frutta, verdura, cereali integrali, olio d\'oliva, pesce e legumi. Carne rossa con moderazione.',
    icon: '🫒',
  })

  return suggestions
}

const CATEGORY_COLORS: Record<string, string> = {
  dieta: '#2d7a4f',
  alimento: '#f0a500',
  abitudine: '#5b6ee1',
  motivazione: '#e07b39',
}

const CATEGORY_LABELS: Record<string, string> = {
  dieta: 'Dieta',
  alimento: 'Alimento',
  abitudine: 'Abitudine',
  motivazione: 'Motivazione',
}

export default function AiSuggestions() {
  const { profile } = useProfile()
  const { getTodayMeals } = useMeals()
  const todayMeals = getTodayMeals()

  const totalCals = todayMeals.reduce((s, m) => s + m.calories, 0)
  const totalProtein = todayMeals.reduce((s, m) => s + m.protein, 0)

  const [activeCategory, setActiveCategory] = useState<string>('tutti')

  const suggestions = generateSuggestions(profile, totalCals, totalProtein)
  const filtered = activeCategory === 'tutti'
    ? suggestions
    : suggestions.filter((s) => s.category === activeCategory)

  const categories = ['tutti', ...Array.from(new Set(suggestions.map((s) => s.category)))]

  return (
    <div className="page">
      <div>
        <h2 className="page-title">Suggerimenti AI 🤖</h2>
        <p className="page-subtitle">Consigli personalizzati basati sul tuo profilo e i tuoi pasti</p>
      </div>

      {/* AI info card */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #2d7a4f, #3a9b64)', color: '#fff' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 32 }}>🤖</span>
          <div>
            <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Analisi personalizzata</p>
            <p style={{ fontSize: 13, opacity: 0.9 }}>
              I suggerimenti sono generati in base al tuo obiettivo ({profile.goal.replace(/_/g, ' ')}),
              ai pasti registrati oggi e al tuo profilo nutrizionale.
            </p>
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              border: '1.5px solid',
              borderColor: activeCategory === cat ? 'var(--color-primary)' : 'var(--color-border)',
              background: activeCategory === cat ? 'var(--color-primary)' : 'transparent',
              color: activeCategory === cat ? '#fff' : 'var(--color-text)',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {cat === 'tutti' ? 'Tutti' : CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Suggestions list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map((suggestion) => (
          <div
            key={suggestion.id}
            className="card"
            style={{ borderLeft: `4px solid ${CATEGORY_COLORS[suggestion.category]}` }}
          >
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 28, flexShrink: 0 }}>{suggestion.icon}</span>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <p style={{ fontWeight: 700, fontSize: 15 }}>{suggestion.title}</p>
                  <span
                    className="badge"
                    style={{
                      background: `${CATEGORY_COLORS[suggestion.category]}20`,
                      color: CATEGORY_COLORS[suggestion.category],
                    }}
                  >
                    {CATEGORY_LABELS[suggestion.category]}
                  </span>
                </div>
                <p style={{ fontSize: 14, color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                  {suggestion.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="card" style={{ background: 'var(--color-surface-alt)', border: '1px dashed var(--color-border)' }}>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
          ⚠️ <strong>Nota:</strong> I suggerimenti AI sono informativi e non sostituiscono il parere di un professionista della salute. Consulta sempre il tuo nutrizionista per un piano alimentare personalizzato.
        </p>
      </div>
    </div>
  )
}
