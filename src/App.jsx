import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-xl rounded-3xl border border-slate-700 bg-slate-900 p-8 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <span className="rounded-full bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-300">
            ● System Online
          </span>
          <span className="text-sm text-slate-400">PROMPT RUN</span>
        </div>

        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-violet-400">
          My First Deployment
        </p>

        <h1 className="mb-4 text-4xl font-bold leading-tight sm:text-5xl">
          Ready to build something amazing?
        </h1>

        <p className="mb-8 leading-7 text-slate-400">
          My React app is live! Every successful GitHub push can trigger a
          new Vercel deployment.
        </p>

        <div className="mb-7 rounded-2xl border border-slate-700 bg-slate-950 p-5">
          <p className="mb-2 text-sm text-slate-400">Your practice clicks</p>
          <p className="text-4xl font-bold text-violet-400">{count}</p>
          <button
            onClick={() => setCount(count + 1)}
            className="mt-4 w-full rounded-xl bg-violet-600 px-5 py-3 font-semibold transition hover:bg-violet-500"
          >
            Click to test React
          </button>
        </div>

        <div className="flex items-center justify-between border-t border-slate-700 pt-5 text-sm text-slate-400">
          <span>Built with React + Vite</span>
          <span>🚀 v2.0</span>
        </div>
      </div>
    </div>
  )
}

export default App