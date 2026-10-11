import { useState } from 'react'
import Modal from '../components/Modal.jsx'
import { useFinance } from '../context/FinanceContext'
import { money } from '../utils/financeCalculations'

const initialForm = {
  title: '',
  category: 'Subscription',
  amount: '',
  due: 'Oct 20',
}

export default function Commitments() {
  const {
    commitments,
    addCommitment,
    toggleCommitment,
  } = useFinance()

  const [show, setShow] = useState(false)
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')

  const unpaid = commitments
    .filter((commitment) => !commitment.paid)
    .reduce(
      (total, commitment) =>
        total + (Number(commitment.amount) || 0),
      0
    )

  const unpaidCount = commitments.filter(
    (commitment) => !commitment.paid
  ).length

  function handleChange(event) {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))

    if (error) {
      setError('')
    }
  }

  function handleSubmit(event) {
    event.preventDefault()

    const title = form.title.trim()
    const amount = Number(form.amount)
    const due = form.due.trim()

    if (!title) {
      setError('Please enter a bill or subscription name.')
      return
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setError('Please enter an amount greater than ₹0.')
      return
    }

    if (!due) {
      setError('Please enter the due date.')
      return
    }

    addCommitment({
      title,
      category: form.category,
      amount,
      due,
    })

    setForm({ ...initialForm })
    setError('')
    setShow(false)
  }

  function handleClose() {
    setShow(false)
    setError('')
  }

  return (
    <div className="page-stack">
      <section className="page-intro">
        <div>
          <div className="eyebrow">
            THE THINGS FUTURE YOU ALREADY PROMISED
          </div>

          <h2>The non-negotiables.</h2>

          <p>
            Bills don't have to be a surprise plot twist.
          </p>
        </div>

        <button
          type="button"
          className="primary-btn"
          onClick={() => setShow(true)}
        >
          ＋ Add commitment
        </button>
      </section>

      <section className="commitment-banner">
        <div>
          <div className="eyebrow">
            MONEY ALREADY SPOKEN FOR
          </div>

          <strong>{money(unpaid)}</strong>

          <p>
            Still due this month. Plan around it, not after it.
          </p>
        </div>

        <div className="commitment-orbit" aria-hidden="true">
          ₹<span>!</span>
        </div>
      </section>

      <section className="panel table-panel">
        <div className="panel-head">
          <div>
            <h3>Your upcoming commitments</h3>
            <p className="muted">
              Tap a bill when it has been paid.
            </p>
          </div>

          <span className="count-pill">
            {unpaidCount} still to go
          </span>
        </div>

        <div className="commitment-list">
          {commitments.length === 0 ? (
            <div className="empty-state">
              <p>No commitments yet.</p>
              <p className="muted">
                Add your first bill or subscription to get started.
              </p>

              <button
                type="button"
                className="primary-btn"
                onClick={() => setShow(true)}
              >
                ＋ Add commitment
              </button>
            </div>
          ) : (
            commitments.map((commitment) => (
              <div
                className={`commitment-row ${
                  commitment.paid ? 'is-paid' : ''
                }`}
                key={commitment.id}
              >
                <button
                  type="button"
                  className={`check-button ${
                    commitment.paid ? 'checked' : ''
                  }`}
                  onClick={() => toggleCommitment(commitment.id)}
                  aria-label={
                    commitment.paid
                      ? `Mark ${commitment.title} unpaid`
                      : `Mark ${commitment.title} paid`
                  }
                  aria-pressed={Boolean(commitment.paid)}
                >
                  {commitment.paid ? '✓' : ''}
                </button>

                <div className="commitment-icon" aria-hidden="true">
                  {commitment.category === 'Subscription'
                    ? '◉'
                    : commitment.category === 'Essential'
                      ? '⌂'
                      : '▦'}
                </div>

                <div className="transaction-info">
                  <strong>{commitment.title}</strong>
                  <small>
                    {commitment.category} · Due {commitment.due}
                  </small>
                </div>

                <strong className="commitment-amount">
                  {money(Number(commitment.amount) || 0)}
                </strong>

                <span
                  className={`status-pill ${
                    commitment.paid
                      ? 'status-paid'
                      : 'status-due'
                  }`}
                >
                  {commitment.paid ? 'Paid' : 'Upcoming'}
                </span>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="tip-strip">
        <span>✦</span>
        <p>
          <strong>Friendly reminder:</strong> A subscription is a tiny
          recurring decision. If you don't use it, future-you might
          want that ₹149 back.
        </p>
      </section>

      {show && (
        <Modal
          title="Put it on the calendar"
          subtitle="Name the bill now so it doesn't surprise you later."
          onClose={handleClose}
        >
          <form
            className="form-stack"
            onSubmit={handleSubmit}
            noValidate
          >
            <label>
              Bill or subscription

              <input
                autoFocus
                required
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Wi-Fi bill"
              />
            </label>

            <label>
              Amount (₹)

              <input
                type="number"
                name="amount"
                min="1"
                step="0.01"
                required
                value={form.amount}
                onChange={handleChange}
                placeholder="499"
              />
            </label>

            <label>
              Type

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                {[
                  'Subscription',
                  'Monthly bill',
                  'Essential',
                  'Membership',
                  'Other',
                ].map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Due date

              <input
                name="due"
                value={form.due}
                onChange={handleChange}
                placeholder="Oct 20"
                required
              />
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
              Add commitment ↗
            </button>
          </form>
        </Modal>
      )}
    </div>
  )
}

