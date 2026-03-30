// src/components/FinanceVisualizer.jsx
import { useState, useMemo } from 'react'

const LOAN_TYPES = [
  {
    id: 'cash',
    label: 'Pay Cash',
    icon: '💵',
    desc: 'No financing — pay the full amount upfront.',
    defaultRate: 0,
    defaultTerm: 0,
    rateRange: null,
  },
  {
    id: 'personal',
    label: 'Personal Loan',
    icon: '🏦',
    desc: 'Unsecured. Fast approval, higher rates. No home equity required.',
    defaultRate: 11.5,
    defaultTerm: 60,
    rateRange: [6, 20],
    termOptions: [24, 36, 48, 60, 72, 84],
  },
  {
    id: 'heloc',
    label: 'HELOC',
    icon: '🏡',
    desc: 'Home Equity Line of Credit. Lower rates, uses your home as collateral.',
    defaultRate: 8.5,
    defaultTerm: 120,
    rateRange: [6, 13],
    termOptions: [60, 84, 120, 180, 240],
  },
  {
    id: 'construction',
    label: 'Construction Loan',
    icon: '🔨',
    desc: 'Short-term loan for building. Converts to mortgage after completion.',
    defaultRate: 7.5,
    defaultTerm: 12,
    rateRange: [5.5, 12],
    termOptions: [12, 18, 24],
    note: 'Typically converts to a 15–30yr mortgage at completion.',
  },
]

function calcMonthly(principal, annualRate, termMonths) {
  if (!annualRate || !termMonths) return 0
  const r = annualRate / 100 / 12
  return (principal * r * Math.pow(1 + r, termMonths)) / (Math.pow(1 + r, termMonths) - 1)
}

function calcTotal(monthly, termMonths) {
  return monthly * termMonths
}

function fmt(n) {
  return '$' + Math.round(n).toLocaleString()
}

function MonthlyBar({ label, value, max, color }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0
  return (
    <div className="fin-bar-row">
      <span className="fin-bar-label">{label}</span>
      <div className="fin-bar-track">
        <div className="fin-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="fin-bar-value">{fmt(value)}<span className="fin-bar-sub">/mo</span></span>
    </div>
  )
}

export default function FinanceVisualizer({ totalCost }) {
  const [selectedLoan, setSelectedLoan] = useState('personal')
  const [downPct, setDownPct] = useState(20)
  const [rate, setRate] = useState(null)   // null = use default
  const [term, setTerm] = useState(null)   // null = use default

  const loan = LOAN_TYPES.find(l => l.id === selectedLoan)
  const effectiveRate = rate ?? loan.defaultRate
  const effectiveTerm = term ?? loan.defaultTerm

  const downAmount = Math.round(totalCost * (downPct / 100))
  const principal = totalCost - downAmount

  const monthly = useMemo(() => {
    if (selectedLoan === 'cash') return 0
    return calcMonthly(principal, effectiveRate, effectiveTerm)
  }, [selectedLoan, principal, effectiveRate, effectiveTerm])

  const totalPaid = selectedLoan === 'cash' ? totalCost : calcTotal(monthly, effectiveTerm)
  const totalInterest = selectedLoan === 'cash' ? 0 : totalPaid - principal

  // Principal portion of monthly
  const monthlyPrincipal = selectedLoan === 'cash' ? 0 : principal / effectiveTerm
  const monthlyInterest = monthly - monthlyPrincipal

  const maxBar = monthly * 1.1 || 1

  const handleLoanSelect = (id) => {
    setSelectedLoan(id)
    setRate(null)
    setTerm(null)
  }

  return (
    <div className="fin-wrap">
      <div className="fin-header">
        <h3>Financing Options</h3>
        <p>Explore how to fund your <strong>{fmt(totalCost)}</strong> project.</p>
      </div>

      {/* Loan Type Selector */}
      <div className="fin-loan-grid">
        {LOAN_TYPES.map(l => (
          <button
            key={l.id}
            className={`fin-loan-card ${selectedLoan === l.id ? 'active' : ''}`}
            onClick={() => handleLoanSelect(l.id)}
            type="button"
          >
            <span className="fin-loan-icon">{l.icon}</span>
            <span className="fin-loan-label">{l.label}</span>
          </button>
        ))}
      </div>

      <p className="fin-loan-desc">{loan.desc}</p>
      {loan.note && <p className="fin-loan-note">⚠ {loan.note}</p>}

      {selectedLoan === 'cash' ? (
        <div className="fin-cash-box">
          <div className="fin-cash-amount">{fmt(totalCost)}</div>
          <div className="fin-cash-label">Full payment due at project completion</div>
          <div className="fin-cash-saving">
            <span className="fin-saving-tag">✓ No interest paid</span>
            <span className="fin-saving-tag">✓ No monthly obligation</span>
            <span className="fin-saving-tag">✓ Fastest equity build</span>
          </div>
        </div>
      ) : (
        <>
          {/* Controls */}
          <div className="fin-controls">
            <div className="fin-control-group">
              <label>
                Down Payment
                <span className="fin-control-val">{downPct}% — {fmt(downAmount)}</span>
              </label>
              <input
                type="range"
                min={0} max={50} step={5}
                value={downPct}
                onChange={e => setDownPct(Number(e.target.value))}
                className="fin-slider"
              />
              <div className="fin-slider-ticks">
                <span>0%</span><span>10%</span><span>20%</span><span>30%</span><span>40%</span><span>50%</span>
              </div>
            </div>

            <div className="fin-control-row">
              <div className="fin-control-group half">
                <label>
                  Interest Rate
                  <span className="fin-control-val">{effectiveRate}%</span>
                </label>
                <input
                  type="range"
                  min={loan.rateRange[0]}
                  max={loan.rateRange[1]}
                  step={0.25}
                  value={effectiveRate}
                  onChange={e => setRate(Number(e.target.value))}
                  className="fin-slider"
                />
                <div className="fin-slider-ticks">
                  <span>{loan.rateRange[0]}%</span>
                  <span>{loan.rateRange[1]}%</span>
                </div>
              </div>

              <div className="fin-control-group half">
                <label>Loan Term</label>
                <div className="fin-term-pills">
                  {loan.termOptions.map(t => (
                    <button
                      key={t}
                      type="button"
                      className={`fin-term-pill ${effectiveTerm === t ? 'active' : ''}`}
                      onClick={() => setTerm(t)}
                    >
                      {t >= 12 ? `${t / 12}yr` : `${t}mo`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Payment Breakdown */}
          <div className="fin-result-box">
            <div className="fin-monthly-hero">
              <span className="fin-monthly-amount">{fmt(monthly)}</span>
              <span className="fin-monthly-label">/ month</span>
            </div>
            <div className="fin-monthly-sub">
              Over {effectiveTerm >= 12 ? `${effectiveTerm / 12} years` : `${effectiveTerm} months`}
              {' · '}Loan amount: {fmt(principal)}
            </div>

            <div className="fin-bars">
              <MonthlyBar
                label="Principal"
                value={monthlyPrincipal}
                max={maxBar}
                color="var(--amber)"
              />
              <MonthlyBar
                label="Interest"
                value={monthlyInterest}
                max={maxBar}
                color="var(--rust-light)"
              />
            </div>

            <div className="fin-totals">
              <div className="fin-total-item">
                <span className="fin-total-label">Down Payment</span>
                <span className="fin-total-val">{fmt(downAmount)}</span>
              </div>
              <div className="fin-total-item">
                <span className="fin-total-label">Total Interest</span>
                <span className="fin-total-val interest">{fmt(totalInterest)}</span>
              </div>
              <div className="fin-total-item">
                <span className="fin-total-label">Total Cost of Financing</span>
                <span className="fin-total-val total">{fmt(totalPaid + downAmount)}</span>
              </div>
            </div>
          </div>
        </>
      )}

      <p className="fin-disclaimer">
        Estimates only. Actual rates depend on your credit score, lender, and market conditions. Consult a financial advisor before financing.
      </p>
    </div>
  )
}
