import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Overview from './pages/Overview'
import Transactions from './pages/Transactions'
import DecisionLab from './pages/DecisionLab'
import Goals from './pages/Goals'
import Commitments from './pages/Commitments'
import Forecast from './pages/Forecast'
import { useFinance } from './context/FinanceContext'
import './App.css'
const pageTitles = {
  overview: 'Your money, in motion.',
  transactions: 'Every rupee has a story.',
  decision: 'Your choices, in motion.',
  goals: 'Make future-you proud.',
  commitments: 'Plan for what’s already promised.',
  forecast: 'Let’s look ahead.',
}

export default function App() {
  const [active, setActive] = useState('overview')

  const { toast, day, setDay } = useFinance()

  const pages = {
    overview: <Overview onNavigate={setActive} />,
    transactions: <Transactions />,
    decision: <DecisionLab />,
    goals: <Goals />,
    commitments: <Commitments />,
    forecast: <Forecast />,
  }

  function resetDemoData() {
    const confirmReset = window.confirm(
      'Are you sure you want to reset your demo data?'
    )

    if (!confirmReset) return

    localStorage.removeItem('aftermoney-transactions')
    localStorage.removeItem('aftermoney-goals')
    localStorage.removeItem('aftermoney-commitments')

    window.location.reload()
  }

  return (
    <div className="app-shell">
      <Sidebar active={active} onNavigate={setActive} />

      <main className="main-content">
        <Topbar
          day={day}
          setDay={setDay}
          title={pageTitles[active]}
        />

        <div className="content-wrap">
  {pages[active] || pages.overview}

  <footer className="page-footer">
            <span>AFTER/MONEY © 2026</span>

            <span>
              BUILT FOR REAL LIFE, NOT PERFECT SPREADSHEETS.
            </span>

            <button onClick={resetDemoData}>
              Reset demo data ↺
            </button>
          </footer>
        </div>
      </main>

      {toast && (
        <div className="toast">
          <span>✓</span>
          {toast}
        </div>
      )}
    </div>
  )
}






