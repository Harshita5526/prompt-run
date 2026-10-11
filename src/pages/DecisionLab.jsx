

import { useEffect, useMemo, useRef, useState } from 'react'

import { useFinance } from '../context/FinanceContext'

import {
  getDailyAllowance,
  getRisk,
  getForecast,
  money,
} from '../utils/financeCalculations'

export default function DecisionLab() {
  const {
    balance,
    day,
    commitments,
    goals,
    addTransaction,
  } = useFinance()

  const [amount, setAmount] = useState(650)
  const [choice, setChoice] = useState('want')
  const [title, setTitle] = useState('That little treat')
  const [saved, setSaved] = useState(false)

  const timeoutRef = useRef(null)

  const availableBalance = Math.max(0, Number(balance) || 0)
  const safeAmount = Math.min(
    Math.max(0, Number(amount) || 0),
    availableBalance
  )

  const futureBalance = availableBalance - safeAmount

  const beforeAllowance = getDailyAllowance(
    availableBalance,
    day
  )

  const afterAllowance = getDailyAllowance(
    futureBalance,
    day
  )

  const currentRisk = getRisk(
    availableBalance,
    10000,
    day,
    commitments
  )

  const futureRisk = getRisk(
    futureBalance,
    10000,
    day,
    commitments
  )

  const forecastBefore = getForecast(
    availableBalance,
    day,
    commitments
  )

  const forecastAfter = getForecast(
    futureBalance,
    day,
    commitments
  )

  const goalImpact = useMemo(() => {
    return goals.reduce((sum, goal) => {
      const target = Number(goal.target) || 0
      const savedAmount = Number(goal.saved) || 0
      const remaining = Math.max(0, target - savedAmount)

      return sum + Math.min(remaining, safeAmount)
    }, 0)
  }, [goals, safeAmount])

  const unpaidCommitments = commitments
    .filter((commitment) => !commitment.paid)
    .reduce(
      (sum, commitment) =>
        sum + (Number(commitment.amount) || 0),
      0
    )

  const safe = futureBalance - unpaidCommitments

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  function handleAmountChange(event) {
    const value = Number(event.target.value)

    setAmount(
      Math.max(0, Math.min(value, availableBalance))
    )

    setSaved(false)
  }

  function handleQuickAmount(value) {
    setAmount(Math.min(value, availableBalance))
    setSaved(false)
  }

  function handleChoiceChange(id) {
    setChoice(id)

    if (id === 'save') {
      setTitle('Put it toward savings')
    } else if (title === 'Put it toward savings') {
      setTitle(id === 'need' ? 'An essential purchase' : 'That little treat')
    }

    setSaved(false)
  }

  function commitDecision() {
    const cleanTitle = title.trim()

    if (!cleanTitle) {
      return
    }

    if (
      !Number.isFinite(safeAmount) ||
      safeAmount <= 0 ||
      safeAmount > availableBalance
    ) {
      return
    }

    // The existing context records transactions, not goal transfers.
    // Therefore, this records the planned allocation in transaction history.
    addTransaction({
      title: cleanTitle,
      category:
        choice === 'need'
          ? 'Essential'
          : choice === 'save'
            ? 'Savings'
            : 'Lifestyle',
      amount: safeAmount,
      type: 'expense',
    })

    setSaved(true)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setSaved(false)
      timeoutRef.current = null
    }, 2200)
  }

  return (
    <div className="page-stack">
      <section className="page-intro">
        <div>
          <div className="eyebrow">
            THE MULTIVERSE OF YOUR MONEY
          </div>

          <h2>What if…?</h2>

          <p>
            Try a decision on for size before you spend a single rupee.
          </p>
        </div>

        <span className="lab-stamp">✳ DECISION LAB</span>
      </section>

      <div className="decision-layout">
        <section className="panel decision-controls">
          <div className="eyebrow">01 / YOUR POSSIBLE MOVE</div>

          <h3>What are we thinking?</h3>

          <label className="field-label">
            Give this decision a name

            <input
              value={title}
              onChange={(event) => {
                setTitle(event.target.value)
                setSaved(false)
              }}
              placeholder="e.g. New headphones"
              maxLength={100}
            />
          </label>

          <div className="choice-grid">
            {[
              {
                id: 'need',
                emoji: '🧠',
                name: 'A need',
                desc: 'Actually important',
              },
              {
                id: 'want',
                emoji: '✨',
                name: 'A want',
                desc: 'Would be nice',
              },
              {
                id: 'save',
                emoji: '🌱',
                name: 'Save instead',
                desc: 'Future me says thanks',
              },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                className={`choice-card ${
                  choice === item.id ? 'choice-active' : ''
                }`}
                onClick={() => handleChoiceChange(item.id)}
                aria-pressed={choice === item.id}
              >
                <span>{item.emoji}</span>
                <strong>{item.name}</strong>
                <small>{item.desc}</small>
              </button>
            ))}
          </div>

          <div className="amount-heading">
            <label htmlFor="decision-amount">Price tag</label>
            <strong>{money(safeAmount)}</strong>
          </div>

          <input
            id="decision-amount"
            className="amount-slider"
            type="range"
            min="0"
            max={Math.max(100, availableBalance)}
            step="50"
            value={safeAmount}
            onChange={handleAmountChange}
            aria-label="Choose the decision amount"
          />

          <div className="range-labels">
            <span>₹0</span>
            <span>{money(availableBalance)} available</span>
          </div>

          <div className="quick-amounts">
            {[150, 350, 650, 1200].map((value) => (
              <button
                key={value}
                type="button"
                className={
                  safeAmount === Math.min(value, availableBalance)
                    ? 'quick-active'
                    : ''
                }
                onClick={() => handleQuickAmount(value)}
                aria-pressed={
                  safeAmount === Math.min(value, availableBalance)
                }
              >
                {money(value)}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="primary-btn full-button"
            onClick={commitDecision}
            disabled={
              safeAmount <= 0 ||
              safeAmount > availableBalance ||
              !title.trim()
            }
          >
            Make it real ↗
          </button>

          <p className="micro-note">
            Nothing changes until you confirm the decision.
          </p>
        </section>

        <section className="panel impact-panel">
          <div className="impact-header">
            <div>
              <div className="eyebrow">
                02 / THE RIPPLE EFFECT
              </div>

              <h3>Your money, two timelines.</h3>
            </div>

            <span className="live-pill">
              <i />
              LIVE SIMULATION
            </span>
          </div>

          <div className="timeline-card">
            <div className="timeline-col">
              <small>IF YOU DON'T</small>

              <strong>{money(availableBalance)}</strong>

              <span>Balance stays</span>

              <div className="timeline-line">
                <i style={{ width: '100%' }} />
              </div>

              <small>Daily allowance</small>
              <b>{money(beforeAllowance)}</b>

              <small>Month-end forecast</small>
              <b>{money(forecastBefore)}</b>
            </div>

            <div className="timeline-vs">VS</div>

            <div className="timeline-col future-col">
              <small>IF YOU DO</small>

              <strong>{money(futureBalance)}</strong>

              <span>After this move</span>

              <div className="timeline-line">
                <i
                  style={{
                    width: `${
                      availableBalance > 0
                        ? Math.max(
                            0,
                            Math.min(
                              100,
                              (futureBalance / availableBalance) * 100
                            )
                          )
                        : 0
                    }%`,
                  }}
                />
              </div>

              <small>Daily allowance</small>

              <b
                className={
                  afterAllowance < beforeAllowance
                    ? 'negative'
                    : ''
                }
              >
                {money(afterAllowance)}{' '}
                <em>
                  {afterAllowance - beforeAllowance > 0 ? '+' : ''}
                  {money(afterAllowance - beforeAllowance)}
                </em>
              </b>

              <small>Month-end forecast</small>

              <b
                className={
                  forecastAfter < forecastBefore
                    ? 'negative'
                    : ''
                }
              >
                {money(forecastAfter)}
              </b>
            </div>
          </div>

          <div className="impact-callout">
            <span className="callout-icon">✳</span>

            <div>
              <strong>
                {futureRisk.score > currentRisk.score
                  ? 'This move raises your money risk.'
                  : choice === 'save'
                    ? 'Future-you gets a little stronger.'
                    : `Your future changes by ${money(safeAmount)}.`}
              </strong>

              <p>
                {futureRisk.note} After unpaid commitments, your
                flexible balance would be {money(safe)}.
              </p>
            </div>
          </div>

          <div className="impact-bottom">
            <div>
              <small>RISK BEFORE</small>

              <span className={`risk-pill ${currentRisk.tone}`}>
                {currentRisk.label}
              </span>
            </div>

            <div className="arrow-change">→</div>

            <div>
              <small>RISK AFTER</small>

              <span className={`risk-pill ${futureRisk.tone}`}>
                {futureRisk.label}
              </span>
            </div>

            <div className="goal-mini-impact">
              <small>GOALS THAT COULD FEEL IT</small>

              <strong>
                {goals.length} active · up to {money(goalImpact)}
              </strong>
            </div>
          </div>

          {saved && (
            <div className="success-banner" role="status">
              ✓ Decision added to Money Moves. Your dashboard has updated.
            </div>
          )}
        </section>
      </div>

      <section className="tip-strip">
        <span>✦</span>

        <p>
          <strong>Money thought:</strong> You don't have to say no to
          everything. You just deserve to know what your yes costs.
        </p>
      </section>
    </div>
  )
}
