
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

import {
  getBalance,
  getSpent,
  INITIAL_BUDGET,
} from '../utils/financeCalculations'

const FinanceContext = createContext(null)

// Initial transactions
const starterTransactions = [
  {
    id: 1,
    title: 'Cafe with friends',
    category: 'Food & drink',
    amount: 240,
    type: 'expense',
    day: 12,
    date: 'Today',
  },
  {
    id: 2,
    title: 'Metro recharge',
    category: 'Travel',
    amount: 300,
    type: 'expense',
    day: 11,
    date: 'Yesterday',
  },
  {
    id: 3,
    title: 'Freelance design',
    category: 'Income',
    amount: 1200,
    type: 'income',
    day: 10,
    date: 'Oct 10',
  },
  {
    id: 4,
    title: 'Music subscription',
    category: 'Subscriptions',
    amount: 119,
    type: 'expense',
    day: 9,
    date: 'Oct 9',
  },
]

// Initial savings goals
const starterGoals = [
  {
    id: 1,
    title: 'Concert fund',
    target: 2500,
    saved: 900,
    emoji: '🎟️',
    color: 'lilac',
  },
  {
    id: 2,
    title: 'Emergency cushion',
    target: 3000,
    saved: 1200,
    emoji: '🛟',
    color: 'mint',
  },
]

// Initial commitments
const starterCommitments = [
  {
    id: 1,
    title: 'Phone plan',
    category: 'Monthly bill',
    amount: 399,
    due: 'Oct 15',
    paid: false,
  },
  {
    id: 2,
    title: 'Streaming duo',
    category: 'Subscription',
    amount: 149,
    due: 'Oct 18',
    paid: false,
  },
  {
    id: 3,
    title: 'Gym membership',
    category: 'Membership',
    amount: 599,
    due: 'Oct 21',
    paid: false,
  },
  {
    id: 4,
    title: 'Room contribution',
    category: 'Essential',
    amount: 1200,
    due: 'Oct 25',
    paid: true,
  },
]

// Safely read data from localStorage
function readStorage(key, fallback) {
  try {
    const savedData = localStorage.getItem(key)

    if (!savedData) {
      return fallback
    }

    const parsedData = JSON.parse(savedData)

    return Array.isArray(parsedData) ? parsedData : fallback
  } catch {
    return fallback
  }
}

// Safely save data to localStorage
function writeStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error(`Unable to save ${key} to localStorage:`, error)
  }
}

export function FinanceProvider({ children }) {
  const [transactions, setTransactions] = useState(() =>
    readStorage('aftermoney-transactions', starterTransactions)
  )

  const [goals, setGoals] = useState(() =>
    readStorage('aftermoney-goals', starterGoals)
  )

  const [commitments, setCommitments] = useState(() =>
    readStorage('aftermoney-commitments', starterCommitments)
  )

  const [day, setDay] = useState(12)
  const [toast, setToast] = useState('')

  // Calculate current balance and total spending
  const balance = getBalance(INITIAL_BUDGET, transactions)
  const spent = getSpent(transactions)

  // Save changes whenever the data changes
  useEffect(() => {
    writeStorage('aftermoney-transactions', transactions)
  }, [transactions])

  useEffect(() => {
    writeStorage('aftermoney-goals', goals)
  }, [goals])

  useEffect(() => {
    writeStorage('aftermoney-commitments', commitments)
  }, [commitments])

  // Automatically hide notification
  useEffect(() => {
    if (!toast) {
      return
    }

    const timeoutId = setTimeout(() => {
      setToast('')
    }, 2400)

    return () => clearTimeout(timeoutId)
  }, [toast])

    // Add a new transaction
    
  // Add a new income or expense
  const addTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now(),
      day: Number(day),
      date: `Day ${day} · Just now`,
    }

    setTransactions((current) => [
      newTransaction,
      ...current,
    ])

    setToast(
      `${transaction.type === 'income' ? 'Income' : 'Expense'} added to your story`
    )
  }
  
    // Add a new savings goal
  const addGoal = (goal) => {
    const newGoal = {
      ...goal,
      id: Date.now(),
      saved: 0,
      color: goal.color || 'lilac',
    }

    setGoals((current) => [
      ...current,
      newGoal,
    ])

    setToast('New goal added ✨')
  }
   
  // Add savings to an existing goal
  const addSavingsToGoal = (id, amount) => {
    const value = Number(amount)

    if (!Number.isFinite(value) || value <= 0) {
      return
    }

    const goal = goals.find((item) => item.id === id)

    if (!goal) {
      return
    }

    setGoals((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              saved: (Number(item.saved) || 0) + value,
            }
          : item
      )
    )

    setToast('Savings added to your goal ✨')
  }

  // Add a new commitment
  const addCommitment = (item) => {
    const newCommitment = {
      ...item,
      id: Date.now(),
      paid: false,
    }

    setCommitments((current) => [
      ...current,
      newCommitment,
    ])

    setToast('Commitment added')
  }

  // Mark a commitment paid or unpaid
  const toggleCommitment = (id) => {
    const commitment = commitments.find(
      (item) => item.id === id
    )

    if (!commitment) {
      return
    }

    // If already paid, mark it unpaid and remove
    // the expense created by this payment, if available.
    if (commitment.paid) {
      setCommitments((current) =>
        current.map((item) => {
          if (item.id !== id) {
            return item
          }

          const updatedItem = {
            ...item,
            paid: false,
          }

          delete updatedItem.transactionId

          return updatedItem
        })
      )

      if (commitment.transactionId != null) {
        setTransactions((current) =>
          current.filter(
            (transaction) =>
              transaction.id !== commitment.transactionId
          )
        )
      }

      setToast('Commitment marked unpaid')
      return
    }

    // If unpaid, mark it paid and create its expense.
    const transactionId = Date.now()

    const paymentTransaction = {
      id: transactionId,
      title: commitment.title,
      category: commitment.category,
      amount: Number(commitment.amount) || 0,
      type: 'expense',
      day,
      date: 'Just now',
    }

    setCommitments((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              paid: true,
              transactionId,
            }
          : item
      )
    )

    setTransactions((current) => [
      paymentTransaction,
      ...current,
    ])

    setToast('Commitment marked paid')
  }

  // Shared data and functions for all pages
  const value = {
    transactions,
    goals,
    commitments,
    day,
    setDay,
    balance,
    spent,
    toast,
    addTransaction,
    addGoal,
    addSavingsToGoal,
    addCommitment,
    toggleCommitment,
    setToast,
  }

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  )
}

// Custom hook to access finance data
export function useFinance() {
  const value = useContext(FinanceContext)

  if (!value) {
    throw new Error(
      'useFinance must be used inside FinanceProvider'
    )
  }

  return value
}
