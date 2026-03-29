// src/components/admin/WorkPhasesEditor.jsx
import { useState } from 'react'

const DIY_OPTIONS = [
  { value: 'true',    label: 'DIY OK' },
  { value: 'false',   label: 'Pro Required' },
  { value: 'Partial', label: 'Partial DIY' },
]

// Firestore stores booleans as booleans; we need to handle bool/string
const diyToString = (v) => {
  if (v === true || v === 'true') return 'true'
  if (v === false || v === 'false') return 'false'
  return 'Partial'
}

const stringToDiy = (v) => {
  if (v === 'true') return true
  if (v === 'false') return false
  return 'Partial'
}

export default function WorkPhasesEditor({ workPhases, onChange }) {
  const [activeStyle, setActiveStyle] = useState('underground')
  const [expandedPhase, setExpandedPhase] = useState(null)

  const phases = workPhases[activeStyle] || []

  const updatePhase = (phaseIdx, field, value) => {
    const next = phases.map((p, i) =>
      i === phaseIdx ? { ...p, [field]: value } : p
    )
    onChange({ ...workPhases, [activeStyle]: next })
  }

  const updateTask = (phaseIdx, taskIdx, value) => {
    const tasks = [...phases[phaseIdx].tasks]
    tasks[taskIdx] = value
    updatePhase(phaseIdx, 'tasks', tasks)
  }

  const addTask = (phaseIdx) => {
    updatePhase(phaseIdx, 'tasks', [...phases[phaseIdx].tasks, ''])
  }

  const removeTask = (phaseIdx, taskIdx) => {
    updatePhase(phaseIdx, 'tasks', phases[phaseIdx].tasks.filter((_, i) => i !== taskIdx))
  }

  const addPhase = () => {
    const next = [
      ...phases,
      { phase: 'New Phase', duration: '1–2 weeks', diy: false, tasks: ['Task 1'] },
    ]
    onChange({ ...workPhases, [activeStyle]: next })
    setExpandedPhase(next.length - 1)
  }

  const removePhase = (phaseIdx) => {
    const next = phases.filter((_, i) => i !== phaseIdx)
    onChange({ ...workPhases, [activeStyle]: next })
    if (expandedPhase === phaseIdx) setExpandedPhase(null)
  }

  const movePhase = (phaseIdx, dir) => {
    const next = [...phases]
    const swap = phaseIdx + dir
    if (swap < 0 || swap >= next.length) return
    ;[next[phaseIdx], next[swap]] = [next[swap], next[phaseIdx]]
    onChange({ ...workPhases, [activeStyle]: next })
    setExpandedPhase(swap)
  }

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h2>Work Phases</h2>
        <p>Edit the project phases shown on the Step 5 estimate page. Drag to reorder using the ↑↓ buttons.</p>
      </div>

      <div className="admin-tabs">
        {['underground', 'saferoom'].map(id => (
          <button
            key={id}
            className={`admin-tab ${activeStyle === id ? 'active' : ''}`}
            onClick={() => { setActiveStyle(id); setExpandedPhase(null) }}
          >
            {id === 'underground' ? '⛏ Underground' : '🏠 Safe Room'}
          </button>
        ))}
      </div>

      {phases.map((phase, phaseIdx) => (
        <div key={phaseIdx} className="admin-card">
          <div className="admin-card-toggle phase-toggle">
            <div className="phase-reorder">
              <button
                className="btn-reorder"
                onClick={() => movePhase(phaseIdx, -1)}
                disabled={phaseIdx === 0}
                title="Move up"
              >↑</button>
              <button
                className="btn-reorder"
                onClick={() => movePhase(phaseIdx, 1)}
                disabled={phaseIdx === phases.length - 1}
                title="Move down"
              >↓</button>
            </div>

            <button
              className="admin-card-toggle-inner"
              onClick={() => setExpandedPhase(expandedPhase === phaseIdx ? null : phaseIdx)}
            >
              <div className="admin-card-toggle-left">
                <span className="phase-num-badge">{phaseIdx + 1}</span>
                <div>
                  <span className="admin-card-title">{phase.phase}</span>
                  <span className="admin-card-sub">
                    {phase.duration} · {DIY_OPTIONS.find(o => o.value === diyToString(phase.diy))?.label}
                    · {phase.tasks.length} tasks
                  </span>
                </div>
              </div>
              <span className="admin-chevron">{expandedPhase === phaseIdx ? '▲' : '▼'}</span>
            </button>

            <button
              className="btn-remove phase-remove"
              onClick={() => removePhase(phaseIdx)}
              title="Remove phase"
            >✕</button>
          </div>

          {expandedPhase === phaseIdx && (
            <div className="admin-card-body">
              <div className="admin-field-grid">
                <div className="admin-field">
                  <label>Phase Name</label>
                  <input
                    value={phase.phase}
                    onChange={e => updatePhase(phaseIdx, 'phase', e.target.value)}
                  />
                </div>
                <div className="admin-field">
                  <label>Duration</label>
                  <input
                    value={phase.duration}
                    placeholder="e.g. 1–2 weeks"
                    onChange={e => updatePhase(phaseIdx, 'duration', e.target.value)}
                  />
                </div>
                <div className="admin-field">
                  <label>DIY Suitability</label>
                  <select
                    value={diyToString(phase.diy)}
                    onChange={e => updatePhase(phaseIdx, 'diy', stringToDiy(e.target.value))}
                  >
                    {DIY_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="admin-field" style={{ marginTop: '1rem' }}>
                <label>Tasks</label>
                {phase.tasks.map((task, taskIdx) => (
                  <div key={taskIdx} className="admin-list-row">
                    <input
                      value={task}
                      onChange={e => updateTask(phaseIdx, taskIdx, e.target.value)}
                    />
                    <button
                      className="btn-remove"
                      onClick={() => removeTask(phaseIdx, taskIdx)}
                    >✕</button>
                  </div>
                ))}
                <button className="btn-add-item" onClick={() => addTask(phaseIdx)}>
                  + Add Task
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      <button className="btn-add-phase" onClick={addPhase}>
        + Add Phase
      </button>
    </div>
  )
}
