

import { money, getDailyAllowance, getRisk, getForecast } from '../utils/financeCalculations'
import { useFinance } from '../context/FinanceContext'
import StatCard from '../components/StatCard.jsx'

export default function Overview({ onNavigate }) {
  const {
    balance,
    spent,
    day,
    commitments,
    goals,
    transactions,
  } = useFinance()

  const safeBalance = Number(balance) || 0
  const safeSpent = Number(spent) || 0
  const safeDay = Math.min(30, Math.max(1, Number(day) || 1))

  const allowance = getDailyAllowance(
    safeBalance,
    safeDay,
    commitments
  )
  const risk = getRisk(safeBalance, 10000, safeDay, commitments)
  const forecast = getForecast(safeBalance, safeDay, commitments)

  const unpaidCommitments = commitments.filter(
    (commitment) => !commitment.paid
  )

  const unpaid = unpaidCommitments.reduce(
    (sum, commitment) => sum + (Number(commitment.amount) || 0),
    0
  )

  const goalTotal = goals.reduce(
    (sum, goal) => sum + (Number(goal.target) || 0),
    0
  )

  const savedTotal = goals.reduce(
    (sum, goal) => sum + (Number(goal.saved) || 0),
    0
  )

  const goalProgress = goalTotal > 0
    ? Math.min(100, (savedTotal / goalTotal) * 100)
    : 0

  const currentBar = Math.max(0, Math.min(safeDay - 1, 29))

  
  // Calculate daily spending from recorded expense transactions.
  const dailySpending = Array.from({ length: 30 }, (_, index) => {
    const dayNumber = index + 1

    return transactions.reduce((sum, transaction) => {
      if (transaction.type !== 'expense') return sum

      const amount = Number(transaction.amount) || 0
      const transactionDay = Number(transaction.day)

      return transactionDay === dayNumber ? sum + amount : sum
    }, 0)
  })

  const maxDailySpending = Math.max(...dailySpending, 1)

  function navigateTo(page) {
    if (typeof onNavigate === 'function') {
      onNavigate(page)
    }
  }

  const featuredGoal = goals[0]
  const featuredGoalTarget = Number(featuredGoal?.target) || 0
  const featuredGoalSaved = Number(featuredGoal?.saved) || 0

  const featuredGoalProgress = featuredGoalTarget > 0
    ? Math.min(
        100,
        (featuredGoalSaved / featuredGoalTarget) * 100
      )
    : 0

  return (
    <div className="page-stack">
      <section className="hero-card">
        <div className="hero-copy">
          <div className="hero-kicker">
            <span className="pulse-dot" />
            THE MONTH IS YOURS TO SHAPE
          </div>

          <h2>
            Small choices.
            <br />
            <em>Different endings.</em>
          </h2>

          <p>
            See the future cost of today's choices before they
            become tomorrow's stress.
          </p>

          <button
            type="button"
            className="primary-btn"
            onClick={() => navigateTo('decision')}
          >
            Enter decision lab <span>↗</span>
          </button>

          <div className="hero-footnote">
            ✦ Your budget is a plan, not a punishment.
          </div>
        </div>

        <div
          className="orbit-art"
          role="img"
          aria-label="Money future illustration"
        >
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />

          <div className="coin coin-small">
            <b>₹</b>
            <small>
              YOUR
              <br />
              FUTURE
            </small>
          </div>

          <div className="coin coin-large">
            <b>₹</b>
          </div>

          <span className="star star-one">✦</span>
          <span className="star star-two">✳</span>
          <span className="future-label">FUTURE YOU ↗</span>
          <div className="coin-shadow" />
        </div>

        <div className="hero-metrics">
          <div>
            <small>STARTING POT</small>
            <strong>₹10,000</strong>
          </div>

          <div>
            <small>LEFT TO LIVE ON</small>
            <strong>{money(safeBalance)}</strong>
          </div>

          <div>
            <small>SAFE TO SPEND / DAY</small>
            <strong>{money(allowance)}</strong>
          </div>
        </div>
      </section>

      <section className="stats-grid">
        <StatCard
          icon="↗"
          label="Available balance"
          value={money(safeBalance)}
          note="after recorded moves"
          tone="mint"
        />

        <StatCard
          icon="◷"
          label="Daily allowance"
          value={money(allowance)}
          note={`${Math.max(0, 30 - safeDay)} days remaining`}
          tone="purple"
        />

        <StatCard
          icon="▦"
          label="Future commitments"
          value={money(unpaid)}
          note={`${unpaidCommitments.length} unpaid items`}
          tone="amber"
        />

        <StatCard
          icon="⌁"
          label="Month-end forecast"
          value={money(forecast)}
          note="if habits stay the same"
          tone="pink"
        />
      </section>

      <section className="overview-grid">
        <article className="panel spend-panel">
          <div className="panel-head">
            <div>
              <div className="eyebrow">THE RECEIPT OF REALITY</div>
              <h3>Where it's going</h3>
            </div>

            <span className="live-pill">
              <i />
              LIVE TOTALS
            </span>
          </div>

          <div className="spend-number">
            {money(safeSpent)} <span>spent so far</span>
          </div>

          <div
            className="bar-chart"
            role="img"
            aria-label="Daily spending based on recorded expenses"
          >
            {dailySpending.slice(0, Math.max(8, safeDay)).map((amount, index) => (
              <div
                key={index}
                className={`bar ${
                  index === currentBar ? 'bar-current' : ''
                }`}
                style={{
                  height: `${amount > 0
                    ? Math.max(4, (amount / maxDailySpending) * 100)
                    : 0}%`,
                }}
                title={`Day ${index + 1}: ${money(amount)} spent`}
              />
            ))}
          </div>

          <div className="chart-axis">
            <span>DAY 01</span>
            <span>TODAY · DAY {String(safeDay).padStart(2, '0')}</span>
            <span>DAY 30</span>
          </div>

          <div className="spend-legend">
            <span>
              <i className="legend-dot purple-dot" />
              Spending activity
            </span>

            <span>
              <i className="legend-dot grey-dot" />
              Actual daily spending
            </span>
          </div>
        </article>

        <article className="panel health-panel">
          <div className="panel-head">
            <div>
              <div className="eyebrow">YOUR MONEY WEATHER</div>
              <h3>Financial health</h3>
            </div>

            <span className={`risk-pill ${risk.tone}`}>
              {risk.label}
            </span>
          </div>

          <div className="health-main">
            <div
              className="health-ring"
              style={{
                '--score': `${Math.max(
                  0,
                  Math.min(100, Number(risk.score) || 0)
                )}%`,
              }}
            >
              <div>
                <strong>
                  {100 - Math.max(
                    0,
                    Math.min(100, Number(risk.score) || 0)
                  )}
                </strong>
                <small>/ 100</small>
              </div>
            </div>

            <div className="health-copy">
              <strong>
                {risk.label === 'Looking steady'
                  ? 'You have breathing room.'
                  : risk.label === 'Watch zone'
                    ? 'Keep an eye on the little things.'
                    : 'Time for a money reset.'}
              </strong>

              <p>{risk.note}</p>
            </div>
          </div>

          <div className="health-divider" />

          <div className="health-row">
            <span>Goal progress</span>
            <strong>{Math.round(goalProgress)}%</strong>
          </div>

          <div className="progress-track">
            <span
              style={{
                width: `${goalProgress}%`,
              }}
            />
          </div>

          <button
            type="button"
            className="text-action"
            onClick={() => navigateTo('forecast')}
          >
            Explore your money outlook <span>→</span>
          </button>
        </article>
      </section>

      <section className="bottom-grid">
        <article className="panel recent-panel">
          <div className="panel-head">
            <div>
              <div className="eyebrow">THE LATEST PLOT TWISTS</div>
              <h3>Recent money moves</h3>
            </div>

            <button
              type="button"
              className="text-action"
              onClick={() => navigateTo('transactions')}
            >
              See all →
            </button>
          </div>

          {transactions.slice(0, 3).map((transaction) => (
            <div
              className="transaction-row"
              key={transaction.id}
            >
              <div
                className={`transaction-symbol ${transaction.type}`}
              >
                {transaction.type === 'income' ? '↙' : '↗'}
              </div>

              <div className="transaction-info">
                <strong>{transaction.title}</strong>
                <small>
                  {transaction.category} · {transaction.date}
                </small>
              </div>

              <strong
                className={
                  transaction.type === 'income'
                    ? 'income-value'
                    : 'expense-value'
                }
              >
                {transaction.type === 'income' ? '+' : '−'}
                {money(transaction.amount)}
              </strong>
            </div>
          ))}

          {transactions.length === 0 && (
            <p>No money moves yet. Add your first transaction.</p>
          )}
        </article>

        <article className="panel tiny-goal">
          <div className="eyebrow">A FUTURE-YOU PROMISE</div>

          <h3>
            {featuredGoal?.emoji || '✨'}{' '}
            {featuredGoal?.title || 'Start your first goal'}
          </h3>

          <p>Small amounts still move you forward.</p>

          <div className="goal-progress">
            <span
              style={{
                width: `${featuredGoalProgress}%`,
              }}
            />
          </div>

          <div className="goal-values">
            <strong>{money(featuredGoalSaved)}</strong>
            <span>of {money(featuredGoalTarget)}</span>
          </div>

          <button
            type="button"
            className="secondary-btn"
            onClick={() => navigateTo('goals')}
          >
            Make future plans ↗
          </button>
        </article>
      </section>
    </div>
  )
}
