// src/components/FinanceVisualizer.jsx
import { useState, useMemo } from 'react'

const LOAN_TYPES = [
  {
    id: 'cash',
    label: 'Pay Cash',
    sub: 'No interest',
    defaultRate: 0,
    defaultTerm: 0,
  },
  {
    id: 'personal',
    label: 'Personal Loan',
    sub: '6–20% APR',
    defaultRate: 11.5,
    defaultTerm: 60,
    rateRange: [6, 20],
    termOptions: [24, 36, 48, 60, 72, 84],
  },
  {
    id: 'heloc',
    label: 'HELOC',
    sub: '6–13% APR',
    defaultRate: 8.5,
    defaultTerm: 120,
    rateRange: [6, 13],
    termOptions: [60, 84, 120, 180, 240],
  },
  {
    id: 'construction',
    label: 'Construction',
    sub: '5.5–12% APR',
    defaultRate: 7.5,
    defaultTerm: 12,
    rateRange: [5.5, 12],
    termOptions: [12, 18, 24],
  },
]

function calcMonthly(principal, annualRate, termMonths) {
  if (!annualRate || !termMonths) return 0
  const r = annualRate / 100 / 12
  return (principal * r * Math.pow(1 + r, termMonths)) / (Math.pow(1 + r, termMonths) - 1)
}

function fmt(n) { return '$' + Math.round(n).toLocaleString() }

export default function FinanceVisualizer({ totalCost }) {
  const [selectedLoan, setSelectedLoan] = useState('personal')
  const [downPct, setDownPct]           = useState(20)
  const [rate, setRate]                 = useState(null)
  const [term, setTerm]                 = useState(null)

  const loan          = LOAN_TYPES.find(l => l.id === selectedLoan)
  const effectiveRate = rate ?? loan.defaultRate
  const effectiveTerm = term ?? loan.defaultTerm
  const downAmount    = Math.round(totalCost * (downPct / 100))
  const principal     = totalCost - downAmount

  const monthly = useMemo(() => {
    if (selectedLoan === 'cash') return 0
    return calcMonthly(principal, effectiveRate, effectiveTerm)
  }, [selectedLoan, principal, effectiveRate, effectiveTerm])

  const totalInterest  = selectedLoan === 'cash' ? 0 : monthly * effectiveTerm - principal
  const monthlyPrincipal = selectedLoan === 'cash' ? 0 : principal / effectiveTerm
  const monthlyInterest  = monthly - monthlyPrincipal
  const principalPct     = monthly > 0 ? (monthlyPrincipal / monthly) * 100 : 0

  const handleLoanSelect = (id) => { setSelectedLoan(id); setRate(null); setTerm(null) }

  return (
    <div className="fin-wrap">

      {/* Section title */}
      <div className="fin-title-row">
        <span className="fin-title">Financing</span>
        <span className="fin-project-cost">{fmt(totalCost)}</span>
      </div>

      {/* Loan type — large segmented buttons */}
      <div className="fin-segments">
        {LOAN_TYPES.map(l => (
          <button
            key={l.id}
            type="button"
            className={`fin-seg ${selectedLoan === l.id ? 'active' : ''}`}
            onClick={() => handleLoanSelect(l.id)}
          >
            <span className="fin-seg-label">{l.label}</span>
            <span className="fin-seg-sub">{l.sub}</span>
          </button>
        ))}
      </div>

      {selectedLoan === 'cash' ? (

        /* ── Cash view ── */
        <div className="fin-cash-view">
          <div className="fin-cash-hero">{fmt(totalCost)}</div>
          <div className="fin-cash-tags">
            <span className="fin-tag-good">No interest</span>
            <span className="fin-tag-good">No monthly payment</span>
            <span className="fin-tag-good">Instant equity</span>
          </div>
        </div>

      ) : (

        /* ── Loan view ── */
        <div className="fin-loan-view">

          {/* Monthly hero */}
          <div className="fin-hero-block">
            <div className="fin-hero-amount">{fmt(monthly)}<span className="fin-hero-mo">/mo</span></div>
            <div className="fin-hero-meta">{effectiveTerm >= 12 ? `${effectiveTerm / 12} yr` : `${effectiveTerm} mo`} · {fmt(principal)} financed</div>

            {/* Split bar */}
            <div className="fin-split-bar-wrap">
              <div className="fin-split-bar">
                <div className="fin-split-principal" style={{ width: `${principalPct}%` }} />
              </div>
              <div className="fin-split-legend">
                <span className="fin-split-dot principal" />
                <span>Principal {fmt(monthlyPrincipal)}</span>
                <span className="fin-split-dot interest" />
                <span>Interest {fmt(monthlyInterest)}</span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="fin-controls">

            {/* Down payment */}
            <div className="fin-ctrl">
              <div className="fin-ctrl-head">
                <span className="fin-ctrl-label">Down Payment</span>
                <span className="fin-ctrl-val">{downPct}% · {fmt(downAmount)}</span>
              </div>
              <input type="range" className="fin-slider"
                min={0} max={50} step={5} value={downPct}
                onChange={e => setDownPct(Number(e.target.value))} />
            </div>

            {/* Rate */}
            <div className="fin-ctrl">
              <div className="fin-ctrl-head">
                <span className="fin-ctrl-label">Interest Rate</span>
                <span className="fin-ctrl-val">{effectiveRate}%</span>
              </div>
              <input type="range" className="fin-slider"
                min={loan.rateRange[0]} max={loan.rateRange[1]} step={0.25}
                value={effectiveRate}
                onChange={e => setRate(Number(e.target.value))} />
            </div>

            {/* Term */}
            <div className="fin-ctrl">
              <div className="fin-ctrl-head">
                <span className="fin-ctrl-label">Loan Term</span>
              </div>
              <div className="fin-term-row">
                {loan.termOptions.map(t => (
                  <button key={t} type="button"
                    className={`fin-term-btn ${effectiveTerm === t ? 'active' : ''}`}
                    onClick={() => setTerm(t)}>
                    {t >= 12 ? `${t / 12}yr` : `${t}mo`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Summary strip */}
          <div className="fin-summary-strip">
            <div className="fin-summary-item">
              <span className="fin-summary-label">Down</span>
              <span className="fin-summary-val">{fmt(downAmount)}</span>
            </div>
            <div className="fin-summary-divider" />
            <div className="fin-summary-item">
              <span className="fin-summary-label">Interest</span>
              <span className="fin-summary-val rust">{fmt(totalInterest)}</span>
            </div>
            <div className="fin-summary-divider" />
            <div className="fin-summary-item">
              <span className="fin-summary-label">Total</span>
              <span className="fin-summary-val amber">{fmt(totalCost + totalInterest)}</span>
            </div>
          </div>

        </div>
      )}
    </div>
  )
}
