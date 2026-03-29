// src/pages/AdminPage.jsx
import { useState } from 'react'
import { useAdminData } from '../hooks/useAdminData'
import StylesEditor from '../components/admin/StylesEditor'
import CostFactorsEditor from '../components/admin/CostFactorsEditor'
import AmenitiesEditor from '../components/admin/AmenitiesEditor'
import WorkPhasesEditor from '../components/admin/WorkPhasesEditor'

const TABS = [
  { id: 'styles',      label: 'Styles',       icon: '🏗' },
  { id: 'costs',       label: 'Cost Factors',  icon: '💰' },
  { id: 'amenities',   label: 'Amenities',     icon: '⚙️' },
  { id: 'phases',      label: 'Work Phases',   icon: '📋' },
]

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('styles')
  const {
    styles, setStyles,
    costFactors, setCostFactors,
    workPhases, setWorkPhases,
    loading, saving, lastSaved, error,
    save,
  } = useAdminData()

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner" />
        <p>Loading wizard data…</p>
      </div>
    )
  }

  const handleSave = () => {
    save({ styles, costFactors, workPhases })
  }

  return (
    <div className="admin-page">
      {/* Admin Header */}
      <header className="admin-header">
        <div className="admin-header-left">
          <a href="/" className="admin-back-link">← Back to Wizard</a>
          <div className="admin-logo">
            <span>⛰</span>
            <span>BunkerBuilder</span>
            <span className="admin-badge">Admin</span>
          </div>
        </div>

        <div className="admin-header-right">
          {error && <span className="admin-error-pill">{error}</span>}
          {lastSaved && !error && (
            <span className="admin-saved-pill">
              ✓ Saved {lastSaved.toLocaleTimeString()}
            </span>
          )}
          <button
            className="btn-admin-save"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving…' : '💾 Save All Changes'}
          </button>
        </div>
      </header>

      {/* Tab Nav */}
      <nav className="admin-tab-nav">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`admin-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Editor Area */}
      <main className="admin-main">
        <div className="admin-content">
          {activeTab === 'styles' && (
            <StylesEditor
              styles={styles}
              onChange={setStyles}
            />
          )}
          {activeTab === 'costs' && (
            <CostFactorsEditor
              costFactors={costFactors}
              onChange={setCostFactors}
            />
          )}
          {activeTab === 'amenities' && (
            <AmenitiesEditor
              costFactors={costFactors}
              onChange={setCostFactors}
            />
          )}
          {activeTab === 'phases' && (
            <WorkPhasesEditor
              workPhases={workPhases}
              onChange={setWorkPhases}
            />
          )}
        </div>

        {/* Floating save reminder */}
        <div className="admin-save-bar">
          <span className="admin-save-bar-note">
            Changes are held in memory until you save. Saving updates the live wizard immediately.
          </span>
          <button
            className="btn-admin-save"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving…' : '💾 Save All Changes'}
          </button>
        </div>
      </main>
    </div>
  )
}
