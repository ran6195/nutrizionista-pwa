import type { NutritionistTip } from '../types'

const TIPS: NutritionistTip[] = [
  {
    id: '1',
    title: 'La colazione: il pasto più importante',
    content: 'La colazione fornisce l\'energia necessaria per iniziare la giornata e aiuta a mantenere la concentrazione. Un\'ottima colazione comprende proteine (uova, yogurt, ricotta), carboidrati complessi (pane integrale, avena) e frutta fresca. Saltare la colazione può portare a maggiore fame durante il giorno e scelte alimentari meno salutari.',
    author: 'Dott.ssa Maria Rossi',
    category: 'Pasti',
    icon: '🌅',
  },
  {
    id: '2',
    title: 'Indice glicemico e salute metabolica',
    content: 'L\'indice glicemico (IG) misura la velocità con cui un alimento aumenta la glicemia. Preferire alimenti a basso IG (legumi, verdure, cereali integrali) favorisce un controllo stabile della glicemia, riduce la fame e supporta la perdita di peso. Combinare carboidrati con proteine e grassi sani abbassa ulteriormente la risposta glicemica.',
    author: 'Dott. Luca Ferrari',
    category: 'Nutrizione',
    icon: '📈',
  },
  {
    id: '3',
    title: 'Il ruolo dei grassi buoni',
    content: 'I grassi non sono nemici! I grassi insaturi (omega-3, omega-9) contenuti in avocado, olio d\'oliva extravergine, noci e pesce azzurro sono essenziali per la salute cardiovascolare, la funzione cerebrale e l\'assorbimento delle vitamine liposolubili (A, D, E, K). Limita i grassi saturi e completamente elimina i grassi trans.',
    author: 'Dott.ssa Anna Bianchi',
    category: 'Nutrizione',
    icon: '🫒',
  },
  {
    id: '4',
    title: 'Intestino sano, corpo sano',
    content: 'Il microbioma intestinale influenza non solo la digestione, ma anche il sistema immunitario, l\'umore e il peso corporeo. Per nutrire i batteri "buoni", consuma alimenti fermentati (yogurt, kefir, kimchi), fibra prebiotica (aglio, cipolla, banana acerba) e una varietà ampia di frutta, verdura e cereali integrali.',
    author: 'Dott. Marco Esposito',
    category: 'Salute',
    icon: '🦠',
  },
  {
    id: '5',
    title: 'Proteine: quante e quando',
    content: 'Le proteine sono essenziali per la riparazione muscolare, il sistema immunitario e la sazietà. La dose raccomandata è di 0,8-1,2g per kg di peso corporeo per la popolazione generale, fino a 1,6-2g/kg per chi fa sport. Distribuire le proteine in 4-5 pasti massimizza la sintesi proteica muscolare.',
    author: 'Dott.ssa Elena Conti',
    category: 'Proteine',
    icon: '💪',
  },
  {
    id: '6',
    title: 'L\'importanza dell\'idratazione',
    content: 'L\'acqua regola la temperatura corporea, trasporta nutrienti, favorisce la digestione e influenza il metabolismo. La disidratazione, anche lieve (1-2%), riduce le performance cognitive e fisiche. Bevi acqua regolarmente durante il giorno, non solo quando hai sete. Tisane, brodi e frutta/verdura ad alto contenuto d\'acqua contribuiscono all\'idratazione.',
    author: 'Dott. Giovanni Ricci',
    category: 'Idratazione',
    icon: '💧',
  },
  {
    id: '7',
    title: 'Mindful eating: mangiare consapevolmente',
    content: 'Il mindful eating è la pratica di mangiare con piena consapevolezza. Mangia seduto, senza distrazioni (telefono, TV). Mastica lentamente e assapora il cibo. Riconosci i segnali di fame e sazietà del tuo corpo. Questa pratica riduce l\'alimentazione emotiva, migliora la digestione e favorisce un rapporto più sano con il cibo.',
    author: 'Dott.ssa Sara Pellegrini',
    category: 'Comportamento',
    icon: '🧘',
  },
  {
    id: '8',
    title: 'Cottura e conservazione dei nutrienti',
    content: 'Il metodo di cottura influenza il contenuto nutrizionale. La cottura a vapore conserva meglio vitamine e minerali rispetto alla bollitura. La frittura aggiunge calorie. Consumare alcune verdure crude aumenta l\'apporto di enzimi e vitamine termolabili. Conserva frutta e verdura in frigorifero per rallentare la perdita di nutrienti.',
    author: 'Dott. Andrea Lombardi',
    category: 'Cucina',
    icon: '👨‍🍳',
  },
]

const CATEGORY_COLORS: Record<string, string> = {
  'Pasti': '#2d7a4f',
  'Nutrizione': '#f0a500',
  'Salute': '#5b6ee1',
  'Proteine': '#e07b39',
  'Idratazione': '#4db8e8',
  'Comportamento': '#9b59b6',
  'Cucina': '#e74c3c',
}

export default function Nutritionist() {
  return (
    <div className="page">
      <div>
        <h2 className="page-title">Consigli del Nutrizionista</h2>
        <p className="page-subtitle">Linee guida professionali per la tua salute</p>
      </div>

      {/* Hero card */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #1e5435, #2d7a4f)', color: '#fff' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ fontSize: 40 }}>👨‍⚕️</span>
          <div>
            <p style={{ fontWeight: 700, fontSize: 17, marginBottom: 4 }}>
              Indicazioni professionali
            </p>
            <p style={{ fontSize: 13, opacity: 0.9, lineHeight: 1.5 }}>
              Linee guida basate su evidenze scientifiche, redatte da nutrizionisti certificati.
            </p>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {TIPS.map((tip) => (
          <div key={tip.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 24 }}>{tip.icon}</span>
                <span
                  className="badge"
                  style={{
                    background: `${CATEGORY_COLORS[tip.category] || '#2d7a4f'}20`,
                    color: CATEGORY_COLORS[tip.category] || '#2d7a4f',
                  }}
                >
                  {tip.category}
                </span>
              </div>
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text)', marginBottom: 8 }}>
              {tip.title}
            </h3>
            <p style={{ fontSize: 14, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
              {tip.content}
            </p>
            <p style={{ fontSize: 12, color: 'var(--color-primary)', fontWeight: 600, marginTop: 10 }}>
              — {tip.author}
            </p>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="card" style={{ background: 'var(--color-surface-alt)', border: '1px dashed var(--color-border)' }}>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
          📋 <strong>Nota professionale:</strong> Queste indicazioni hanno scopo informativo generale. Per un piano alimentare personalizzato, consulta un nutrizionista o dietologo abilitato.
        </p>
      </div>
    </div>
  )
}
