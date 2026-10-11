
const navigation = [
  { id: 'overview', icon: '◈', label: 'Overview' },
  { id: 'transactions', icon: '↗', label: 'Transactions' },
  { id: 'decision', icon: '✳', label: 'Decision Lab', special: true },
  { id: 'goals', icon: '◎', label: 'Savings Goals' },
  { id: 'commitments', icon: '▤', label: 'Commitments' },
  { id: 'forecast', icon: '⌁', label: 'Forecast' },
]

export default function Sidebar({ active, onNavigate }) {
  const handleNavigation = (id) => {
    if (typeof onNavigate === 'function') {
      onNavigate(id)
    }
  }

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          A<span>/</span>M
        </div>

        <div className="brand-name">
          <strong>
            AFTER<span>/</span>MONEY
          </strong>
          <small>YOUR MONEY, YOUR MOVES</small>
        </div>
      </div>

      <div className="sidebar-section-label">YOUR SPACE</div>

      <nav className="sidebar-nav" aria-label="Main navigation">
        {navigation.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`nav-item ${active === item.id ? 'active' : ''} ${
              item.special ? 'nav-special' : ''
            }`}
            onClick={() => handleNavigation(item.id)}
            aria-current={active === item.id ? 'page' : undefined}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>

            {item.special && (
              <span className="nav-spark">✦</span>
            )}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-tip">
          <span className="tip-icon">✦</span>
          <strong>Little reminder</strong>
          <p>
            You don't need perfect finances. You need a plan that works for you.
          </p>
        </div>

        <div className="sidebar-profile">
          <div className="profile-avatar">Y</div>

          <div>
            <strong>Your money era</strong>
            <small>30-day challenge</small>
          </div>

          <span className="profile-status">●</span>
        </div>
      </div>
    </aside>
  )
}