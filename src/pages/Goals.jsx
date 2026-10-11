
import { useState } from 'react'
import Modal from "../components/Modal.jsx";
import { useFinance } from '../context/FinanceContext'
import { money } from '../utils/financeCalculations'

const initialForm = {
  title: '',
  target: '',
  emoji: '✨',
}

const emojiOptions = [
  '✨',
  '🎟️',
  '✈️',
  '🛟',
  '💻',
  '🎧',
  '🌱',
  '🏠',
]

export default function Goals() {
  const { goals, addGoal, addSavingsToGoal } = useFinance()
  const [show, setShow] = useState(false)
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')

  function handleChange(event) {
    const { name, value } = event.target

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }))

    setError('')
  }

  function openModal() {
    setForm(initialForm)
    setError('')
    setShow(true)
  }

  function closeModal() {
    setShow(false)
    setError('')
  }

  function submit(event) {
    event.preventDefault()

    const title = form.title.trim()
    const target = Number(form.target)

    if (!title) {
      setError('Please enter a name for your goal.')
      return
    }

    if (!Number.isFinite(target) || target <= 0) {
      setError('Please enter a valid target amount greater than ₹0.')
      return
    }

    addGoal({
      title,
      target,
      emoji: form.emoji,
    })

    setForm(initialForm)
    setError('')
    setShow(false)
  }

  const totalTarget = goals.reduce(
    (sum, goal) => sum + (Number(goal.target) || 0),
    0
  )

  const totalSaved = goals.reduce(
    (sum, goal) => sum + (Number(goal.saved) || 0),
    0
  )

  const overallProgress = totalTarget > 0
    ? Math.min(100, Math.round((totalSaved / totalTarget) * 100))
    : 0

  return (
    <div className="page-stack">
      <section className="page-intro">
        <div>
          <div className="eyebrow">
            A PROMISE TO FUTURE YOU
          </div>

          <h2>Future me.</h2>

          <p>
            Big dreams are just tiny deposits with good PR.
          </p>
        </div>

        <button
          type="button"
          className="primary-btn"
          onClick={openModal}
        >
          ＋ New savings goal
        </button>
      </section>

      <section className="goal-summary">
        <div>
          <small>ACROSS YOUR GOALS</small>

          <strong>
            {money(totalSaved)} <span>saved</span>
          </strong>
        </div>

        <div>
          <small>TARGET AMOUNT</small>
          <strong>{money(totalTarget)}</strong>
        </div>

        <div>
          <small>YOU'RE {overallProgress}% THERE</small>

          <div className="summary-progress">
            <span
              style={{
                width: `${overallProgress}%`,
              }}
            />
          </div>
        </div>

        <div className="goal-sun" aria-hidden="true">
          ✳
        </div>
      </section>

      <div className="goal-grid">
        {goals.map((goal, index) => {
          const target = Number(goal.target) || 0
          const saved = Number(goal.saved) || 0

          const progress = target > 0
            ? Math.min(100, Math.round((saved / target) * 100))
            : 0

          const remaining = Math.max(0, target - saved)

          return (
            <article
              key={goal.id}
              className={`goal-card goal-${goal.color || 'lilac'}`}
            >
              <div className="goal-card-top">
                <span className="goal-emoji">
                  {goal.emoji || '✨'}
                </span>

                <span className="goal-index">
                  GOAL {String(index + 1).padStart(2, '0')}
                </span>
              </div>

              <h3>{goal.title}</h3>

              <p>
                One step closer to the life you want.
              </p>

              <div className="goal-card-numbers">
                <strong>{money(saved)}</strong>
                <span>of {money(target)}</span>
              </div>

              <div
                className="goal-progress"
                role="progressbar"
                aria-label={`${goal.title} progress`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
              >
                <span
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>

              <div className="goal-card-foot">
                <span>{progress}% complete</span>
                <span>{money(remaining)} to go</span>
              </div>
           
  <button
    type="button"
    className="primary-btn"
    onClick={() => {
      const input = window.prompt(
        `How much would you like to save toward ${goal.title}? (₹)`
      )

      if (input === null || input.trim() === '') return

      const amount = Number(input)

      if (!Number.isFinite(amount) || amount <= 0) {
        window.alert('Please enter a valid amount greater than ₹0.')
        return
      }

      if (amount > remaining) {
        window.alert(
          `You only need ${money(remaining)} to reach this goal.`
        )
        return
      }

      addSavingsToGoal(goal.id, amount)
    }}
  >
    + Add savings
  </button>


            </article>
          )
        })}

        <button
          type="button"
          className="goal-add-card"
          onClick={openModal}
        >
          <span>＋</span>

          <strong>Make room for a new dream</strong>

          <small>
            Trips, tech, tiny emergencies, anything.
          </small>
        </button>
      </div>

      <section className="tip-strip">
        <span>✦</span>

        <p>
          <strong>Try this:</strong> Give your goal a name
          that makes you feel something. “Emergency fund”
          is practical; “peace of mind” is personal.
        </p>
      </section>

      {show && (
        <Modal open={show}
          title="Give a dream a name"
          subtitle="Your goals start with a number and a reason."
          onClose={closeModal}
        >
          <form
            className="form-stack"
            onSubmit={submit}
            noValidate
          >
            <label>
              Goal name

              <input
                autoFocus
                required
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Goa trip"
              />
            </label>

            <label>
              Target amount (₹)

              <input
                type="number"
                name="target"
                min="1"
                step="any"
                required
                value={form.target}
                onChange={handleChange}
                placeholder="5000"
              />
            </label>

            <label>
              Pick a vibe

              <select
                name="emoji"
                value={form.emoji}
                onChange={handleChange}
              >
                {emojiOptions.map((emoji) => (
                  <option key={emoji} value={emoji}>
                    {emoji}
                  </option>
                ))}
              </select>
            </label>

            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}

            <button
              className="primary-btn full-button"
              type="submit"
            >
              Plant this goal ↗
            </button>
          </form>
        </Modal>
      )}
    </div>
  )
}
