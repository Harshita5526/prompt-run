

export const INITIAL_BUDGET = 10000

const CHALLENGE_DAYS = 30
const DEFAULT_DAILY_SPEND = 235

function toAmount(value) {
  const amount = Number(value)

  return Number.isFinite(amount) ? amount : 0
}

function getUnpaidTotal(commitments = []) {
  return commitments
    .filter((commitment) => !commitment.paid)
    .reduce(
      (total, commitment) =>
        total + Math.max(0, toAmount(commitment.amount)),
      0
    )
}

export function money(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(toAmount(value))
}

export function getBalance(budget, transactions = []) {
  return toAmount(budget) + transactions.reduce(
    (total, transaction) => {
      const amount = toAmount(transaction.amount)

      if (transaction.type === 'income') {
        return total + amount
      }

      if (transaction.type === 'expense') {
        return total - amount
      }

      return total
    },
    0
  )
}

export function getSpent(transactions = []) {
  return transactions.reduce(
    (total, transaction) => {
      if (transaction.type !== 'expense') {
        return total
      }

      return total + Math.max(0, toAmount(transaction.amount))
    },
    0
  )
}

export function getDailyAllowance(balance, day, commitments = []) {
  const currentDay = Math.min(
    CHALLENGE_DAYS,
    Math.max(1, Math.floor(toAmount(day) || 1))
  )

  const daysLeft = Math.max(
    1,
    CHALLENGE_DAYS - currentDay + 1
  )

  const availableBalance = Math.max(0, toAmount(balance))
  const unpaid = getUnpaidTotal(commitments)
  const safeToSpend = Math.max(0, availableBalance - unpaid)

  return Math.floor(safeToSpend / daysLeft)
}

export function getRisk(
  balance,
  budget = INITIAL_BUDGET,
  day = 1,
  commitments = []
) {
  const currentDay = Math.min(
    CHALLENGE_DAYS,
    Math.max(1, Math.floor(toAmount(day) || 1))
  )

  const daysLeft = Math.max(1, CHALLENGE_DAYS - currentDay + 1)

  const availableBalance = toAmount(balance)
  const startingBudget = toAmount(budget)
  const committed = getUnpaidTotal(commitments)

  const safeBalance = availableBalance - committed
  const dailyAllowance = safeBalance / daysLeft

  const budgetRatio = startingBudget > 0
    ? availableBalance / startingBudget
    : 0

  if (
    safeBalance < 0 ||
    dailyAllowance < 100 ||
    budgetRatio < 0.18
  ) {
    return {
      label: 'High alert',
      tone: 'risk-high',
      score: 82,
      note: 'Your future budget needs attention.',
    }
  }

  if (dailyAllowance < 250 || budgetRatio < 0.42) {
    return {
      label: 'Watch zone',
      tone: 'risk-mid',
      score: 54,
      note: 'A few mindful choices can protect your month.',
    }
  }

  return {
    label: 'Looking steady',
    tone: 'risk-low',
    score: 24,
    note: 'You have room to make thoughtful choices.',
  }
}

export function getForecast(
  balance,
  day,
  commitments = []
) {
  const currentDay = Math.min(
    CHALLENGE_DAYS,
    Math.max(1, Math.floor(toAmount(day) || 1))
  )

  const daysLeft = Math.max(0, CHALLENGE_DAYS - currentDay)
  const unpaid = getUnpaidTotal(commitments)

  const availableBalance = toAmount(balance)

  return (
    availableBalance -
    unpaid -
    daysLeft * DEFAULT_DAILY_SPEND
  )
}
