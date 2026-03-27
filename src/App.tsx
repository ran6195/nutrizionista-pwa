import { Routes, Route, NavLink, useLocation } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import MealLog from './pages/MealLog'
import AiSuggestions from './pages/AiSuggestions'
import Nutritionist from './pages/Nutritionist'
import Profile from './pages/Profile'
import './App.css'

const NAV_ITEMS = [
  { path: '/', label: 'Home', emoji: '🏠' },
  { path: '/pasti', label: 'Pasti', emoji: '🍽️' },
  { path: '/ai', label: 'AI', emoji: '🤖' },
  { path: '/nutrizionista', label: 'Consigli', emoji: '👨‍⚕️' },
  { path: '/profilo', label: 'Profilo', emoji: '👤' },
]

export default function App() {
  const location = useLocation()

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-inner">
          <span className="app-logo">🥦</span>
          <h1 className="app-title">NutriAI</h1>
          <span className="app-subtitle">Il tuo nutrizionista digitale</span>
        </div>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pasti" element={<MealLog />} />
          <Route path="/ai" element={<AiSuggestions />} />
          <Route path="/nutrizionista" element={<Nutritionist />} />
          <Route path="/profilo" element={<Profile />} />
        </Routes>
      </main>

      <nav className="app-nav" aria-label="Navigazione principale">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `nav-item${isActive ? ' nav-item--active' : ''}`
            }
            aria-current={location.pathname === item.path ? 'page' : undefined}
          >
            <span className="nav-emoji" aria-hidden="true">{item.emoji}</span>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
