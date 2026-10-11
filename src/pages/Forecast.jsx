
import { useMemo } from 'react'

import { useFinance } from '../context/FinanceContext'

import {
  getDailyAllowance,
  getForecast,
  getRisk,
  money,
} from '../utils/financeCalculations'

export default function Forecast() {
  const {
    balance,
    day,
    commitments,
    goals,
    spent,
  } = useFinance()

  const safeBalance = Number(balance) || 0
  const safeDay = Math.min(30, Math.max(1, Number(day) || 1))
  const daysLeft = Math.max(0, 30 - safeDay)

  const unpaid = commitments
    .filter((commitment) => !commitment.paid)
    .reduce(
      (sum, commitment) =>
        sum + (Number(commitment.amount) || 0),
      0
    )

  const goalMoney = goals.reduce(
    (sum, goal) => sum + (Number(goal.saved) || 0),
    0
  )

  const forecast = getForecast(
    safeBalance,
    safeDay,
    commitments
  )

  const daily = getDailyAllowance(
    safeBalance,
    safeDay
  )

  const risk = getRisk(
    safeBalance,
    10000,
    safeDay,
    commitments
  )

  const scenarios = useMemo(
    () => [
      {
        label: 'Soft landing',
        daily: 150,
        desc: 'Low-key days, home food, fewer impulse buys',
        color: 'mint',
      },
      {
        label: 'Current rhythm',
        daily: 235,
        desc: 'Your recent habits continue as they are',
        color: 'purple',
      },
      {
        label: 'Main character month',
        daily: 350,
        desc: 'More plans, more convenience spending',
        color: 'pink',
      },
    ],
    []
  )

  return (
    <div className="page-stack">
      <section className="page-intro">
        <div>
          <div className="eyebrow">
            A PEEK AT THE LAST DAY
          </div>

          <h2>Month-end mood.</h2>

          <p>
            It's not a prediction carved in stone.
            It's a heads-up you can act on.
          </p>
        </div>

        <span className={`risk-pill ${risk.tone}`}>
          {risk.label}
        </span>
      </section>

      <section className="forecast-hero">
        <div>
          <div className="eyebrow">
            PROJECTED BALANCE · DAY 30
          </div>

          <strong className={forecast < 0 ? 'negative' : ''}>
            {money(forecast)}
          </strong>

          <p>
            {forecast >= 0
              ? 'There may be money left to breathe.'
              : 'Your current rhythm may push you over budget.'}
          </p>
        </div>

        <div className="forecast-orb" aria-hidden="true">
          <span>₹</span>
          <i />
          <i />
          <i />
        </div>
      </section>

      <div className="stats-grid forecast-stats">
        <article className="stat-card stat-mint">
          <div className="stat-top">
            <span className="stat-icon">◷</span>
            <span className="stat-note">
              {daysLeft} days left
            </span>
          </div>

          <p>Suggested daily limit</p>
          <strong>{money(daily)}</strong>
        </article>

        <article className="stat-card stat-amber">
          <div className="stat-top">
            <span className="stat-icon">▦</span>
            <span className="stat-note">not spent yet</span>
          </div>

          <p>Unpaid commitments</p>
          <strong>{money(unpaid)}</strong>
        </article>

        <article className="stat-card stat-purple">
          <div className="stat-top">
            <span className="stat-icon">◎</span>
            <span className="stat-note">saved so far</span>
          </div>

          <p>Goal money</p>
          <strong>{money(goalMoney)}</strong>
        </article>

        <article className="stat-card stat-pink">
          <div className="stat-top">
            <span className="stat-icon">↗</span>
            <span className="stat-note">already moved</span>
          </div>

          <p>Recorded spending</p>
          <strong>{money(Number(spent) || 0)}</strong>
        </article>
      </div>

      <section className="panel scenarios-panel">
        <div className="panel-head">
          <div>
            <div className="eyebrow">
              THREE POSSIBLE ENDINGS
            </div>

            <h3>Same month. Different choices.</h3>
          </div>
        </div>

        <div className="scenario-grid">
          {scenarios.map((scenario) => {
            const estimatedSpending =
              daysLeft * scenario.daily

            const value =
              safeBalance - unpaid - estimatedSpending

            const meterWidth = Math.max(
              3,
              Math.min(100, (value / 10000) * 100)
            )

            return (
              <article
                className={`scenario-card scenario-${scenario.color}`}
                key={scenario.label}
              >
                <span className="scenario-icon">
                  {scenario.color === 'mint'
                    ? '🌿'
                    : scenario.color === 'purple'
                      ? '〰️'
                      : '⚡'}
                </span>

                <small>{scenario.label}</small>

                <strong className={value < 0 ? 'negative' : ''}>
                  {money(value)}
                </strong>

                <p>{scenario.desc}</p>

                <div
                  className="scenario-meter"
                  role="progressbar"
                  aria-label={`${scenario.label} estimated balance`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.max(
                    0,
                    Math.min(100, meterWidth)
                  )}
                >
                  <span
                    style={{
                      width: `${meterWidth}%`,
                    }}
                  />
                </div>

                <span className="scenario-caption">
                  estimated ending balance
                </span>
              </article>
            )
          })}
        </div>

        <p className="forecast-disclaimer">
          Forecasts are estimates based on the scenario's daily
          spend and unpaid commitments—not financial advice.
          Change your choices to see the picture shift.
        </p>
      </section>

      <section className="tip-strip">
        <span>✦</span>

        <p>
          <strong>Your next move:</strong> If the forecast feels
          tight, start with one small change: pause a subscription,
          lower a daily spend, or protect a savings goal.
        </p>
      </section>
    </div>
  )
}
