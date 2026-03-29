// src/App.jsx
import { useState, useEffect } from 'react'
import StylePicker from './components/StylePicker'
import LotInfo from './components/LotInfo'
import SizeSpecs from './components/SizeSpecs'
import Amenities from './components/Amenities'
import Summary from './components/Summary'
import AdminPage from './pages/AdminPage'
import { useConfigSave } from './hooks/useConfigSave'
import { useBunkerData } from './hooks/useBunkerData'
import './App.css'

const STEPS = ['Style', 'Property', 'Size', 'Systems', 'Estimate']

const canAdvance = (step, style, config) => {
  if (step === 0) return !!style
  if (step === 1) return !!(config.zipCode && config.lotSize)
  if (step === 2) return !!(config.size)
  return true
}

function useRoute() {
  const [route, setRoute] = useState(() => window.location.hash)
  useEffect(() => {
    const handler = () => setRoute(window.location.hash)
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])
  return route
}

export default function App() {
  const route = useRoute()
  if (route === '#/admin') return <AdminPage />
  return <WizardApp />
}

function WizardApp() {
  const [step, setStep] = useState(0)
  const [style, setStyle] = useState(null)
  const [config, setConfig] = useState({})
  const { saveConfig, saveId, saving } = useConfigSave()
  const { styles, costFactors, workPhases, loading } = useBunkerData()

  const updateConfig = (partial) => setConfig((c) => ({ ...c, ...partial }))

  const handleSave = () => {
    saveConfig({ style, config, estimatedAt: new Date().toISOString() })
  }

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1))
  const back = () => setStep((s) => Math.max(s - 1, 0))
  const ready = canAdvance(step, style, config)

  return (
    <div className="app">
      <header className="app-header">
        <div className="logo">
          <span className="logo-icon">⛰</span>
          <span className="logo-text">BunkerBuilder</span>
        </div>
        <div className="header-right">
          <span className="header-tagline">Home Shelter Configurator</span>
          <a href="#/admin" className="admin-link">Admin ⚙</a>
        </div>
      </header>

      <nav className="progress-nav">
        {STEPS.map((label, i) => (
          <button
            key={label}
            className={`progress-step ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}
            onClick={() => i < step && setStep(i)}
            disabled={i > step}
          >
            <span className="step-num">{i < step ? '✓' : i + 1}</span>
            <span className="step-name">{label}</span>
          </button>
        ))}
        <div className="progress-fill" style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }} />
      </nav>

      <main className="wizard-body">
        {loading ? (
          <div className="wizard-loading">
            <div className="admin-spinner" />
            <p>Loading…</p>
          </div>
        ) : (
          <>
            <div className="wizard-card">
              {step === 0 && (
                <StylePicker
                  selected={style}
                  onSelect={(s) => { setStyle(s); setConfig({}) }}
                  styles={styles}
                />
              )}
              {step === 1 && style && (
                <LotInfo config={config} onChange={updateConfig} style={style} />
              )}
              {step === 2 && style && (
                <SizeSpecs config={config} onChange={updateConfig} style={style} costFactors={costFactors} />
              )}
              {step === 3 && style && (
                <Amenities config={config} onChange={updateConfig} style={style} costFactors={costFactors} />
              )}
              {step === 4 && style && (
                <Summary
                  config={config}
                  style={style}
                  onSave={handleSave}
                  saving={saving}
                  saveId={saveId}
                  styles={styles}
                  costFactors={costFactors}
                  workPhases={workPhases}
                />
              )}
            </div>

            <div className="wizard-nav">
              {step > 0 && (
                <button className="btn-back" onClick={back}>← Back</button>
              )}
              {step < STEPS.length - 1 && (
                <button className="btn-next" onClick={next} disabled={!ready}>
                  {ready ? `Continue to ${STEPS[step + 1]} →` : 'Complete this step to continue'}
                </button>
              )}
            </div>
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>BunkerBuilder is for planning purposes only. Always consult licensed professionals.</p>
      </footer>
    </div>
  )
}
