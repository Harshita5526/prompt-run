
import { useState } from 'react'
import { useFinance } from '../context/FinanceContext'
import { money } from '../utils/financeCalculations'
import Modal from '../components/Modal.jsx'

const initialForm = {
  title: '',
  category: 'Food & drink',
  amount: '',
  type: 'expense',
}

const categories = [
  'Food & drink',
  'Travel',
  'Shopping',
  'Bills',
  'Subscriptions',
  'Health',
  'Study',
  'Income',
  'Other',
]

export default function Transactions() {
  const { transactions, addTransaction } = useFinance()

  const [show, setShow] = useState(false)
  const [filter, setFilter] = useState('all')
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')

  const filtered = transactions.filter(
    (transaction) =>
      filter === 'all' || transaction.type === filter
  )

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
    const amount = Number(form.amount)

    if (!title) {
      setError('Please enter a description for this transaction.')
      return
    }

    if (
      !Number.isFinite(amount) ||
      amount <= 0 ||
      amount > 10000
    ) {
      setError('Enter an amount greater than ₹0 and no more than ₹10,000.')
      return
    }

    addTransaction({
      title,
      category: form.category,
      amount,
      type: form.type,
    })

    setForm(initialForm)
    setError('')
    setShow(false)
  }

  return (
    <div className="page-stack">
      <section className="page-intro">
        <div>
          <div className="eyebrow">
            EVERY RUPEE HAS A STORY
          </div>

          <h2>Money moves.</h2>

          <p>
            Track the plot twists, not just the numbers.
          </p>
        </div>

        <button
          type="button"
          className="primary-btn"
          onClick={openModal}
        >
          ＋ Add a money move
        </button>
      </section>

      <section className="panel table-panel">
        <div className="panel-head">
          <div>
            <h3>Your activity</h3>

            <p className="muted">
              {transactions.length} recorded moves
            </p>
          </div>

          <div className="filter-pills">
            {['all', 'expense', 'income'].map((item) => (
              <button
                type="button"
                key={item}
                className={filter === item ? 'selected' : ''}
                aria-pressed={filter === item}
                onClick={() => setFilter(item)}
              >
                {item === 'all'
                  ? 'All moves'
                  : item === 'expense'
                    ? 'Expenses'
                    : 'Income'}
              </button>
            ))}
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="transactions-list">
            {filtered.map((transaction) => (
              <div
                className="transaction-row full-row"
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
                    {transaction.category} · Day{' '}
                    {transaction.day || '—'} · {transaction.date}
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
          </div>
        ) : (
          <div className="empty-state">
            <span>✳</span>

            <h3>No money moves here yet</h3>

            <p>
              {filter === 'all'
                ? 'Add your first transaction to get started.'
                : `No ${filter} transactions found. Try another filter or add a money move.`}
            </p>

            <button
              type="button"
              className="primary-btn"
              onClick={openModal}
            >
              ＋ Add a money move
            </button>
          </div>
        )}
      </section>

      {show && (
        <Modal
        open={show}
          title="Log a money move"
          subtitle="Keep it real. Your dashboard updates automatically."
          onClose={closeModal}
        >
          <form
            className="form-stack"
            onSubmit={submit}
            noValidate
          >
            <div className="segmented">
              <button
                type="button"
                className={form.type === 'expense' ? 'on' : ''}
                aria-pressed={form.type === 'expense'}
                onClick={() => {
                  setForm((previousForm) => ({
                    ...previousForm,
                    type: 'expense',
                  }))
                  setError('')
                }}
              >
                ↗ Expense
              </button>

              <button
                type="button"
                className={form.type === 'income' ? 'on' : ''}
                aria-pressed={form.type === 'income'}
                onClick={() => {
                  setForm((previousForm) => ({
                    ...previousForm,
                    type: 'income',
                    category:
                      previousForm.category === 'Food & drink'
                        ? 'Income'
                        : previousForm.category,
                  }))
                  setError('')
                }}
              >
                ↙ Income
              </button>
            </div>

            <label>
              What was it for?

              <input
                autoFocus
                required
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Late-night momos"
              />
            </label>

            <label>
              Amount (₹)

              <input
                required
                type="number"
                name="amount"
                min="0.01"
                max="10000"
                step="any"
                value={form.amount}
                onChange={handleChange}
                placeholder="250"
              />
            </label>

            <label>
              Category

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
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
              Add to my money story ↗
            </button>
          </form>
        </Modal>
      )}
    </div>
  )
}

