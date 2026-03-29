// src/components/admin/StylesEditor.jsx
import { useState } from 'react'

export default function StylesEditor({ styles, onChange }) {
  const [expanded, setExpanded] = useState(null)

  const updateStyle = (idx, field, value) => {
    const next = styles.map((s, i) => i === idx ? { ...s, [field]: value } : s)
    onChange(next)
  }

  const updateListItem = (idx, field, listIdx, value) => {
    const list = [...styles[idx][field]]
    list[listIdx] = value
    updateStyle(idx, field, list)
  }

  const addListItem = (idx, field) => {
    updateStyle(idx, field, [...styles[idx][field], ''])
  }

  const removeListItem = (idx, field, listIdx) => {
    updateStyle(idx, field, styles[idx][field].filter((_, i) => i !== listIdx))
  }

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h2>Bunker Styles</h2>
        <p>Edit the style cards shown on Step 1 of the wizard.</p>
      </div>

      {styles.map((style, idx) => (
        <div key={style.id} className="admin-card">
          <button
            className="admin-card-toggle"
            onClick={() => setExpanded(expanded === idx ? null : idx)}
          >
            <div className="admin-card-toggle-left">
              <span className="admin-card-icon">{style.icon}</span>
              <div>
                <span className="admin-card-title">{style.name}</span>
                <span className="admin-card-sub">Base price: ${style.basePrice?.toLocaleString()}</span>
              </div>
            </div>
            <span className="admin-chevron">{expanded === idx ? '▲' : '▼'}</span>
          </button>

          {expanded === idx && (
            <div className="admin-card-body">
              <div className="admin-field-grid">
                <div className="admin-field">
                  <label>Style Name</label>
                  <input
                    value={style.name}
                    onChange={e => updateStyle(idx, 'name', e.target.value)}
                  />
                </div>
                <div className="admin-field">
                  <label>Icon (emoji)</label>
                  <input
                    value={style.icon}
                    onChange={e => updateStyle(idx, 'icon', e.target.value)}
                    style={{ maxWidth: 80 }}
                  />
                </div>
                <div className="admin-field full">
                  <label>Tagline</label>
                  <input
                    value={style.tagline}
                    onChange={e => updateStyle(idx, 'tagline', e.target.value)}
                  />
                </div>
                <div className="admin-field full">
                  <label>Description</label>
                  <textarea
                    value={style.description}
                    rows={3}
                    onChange={e => updateStyle(idx, 'description', e.target.value)}
                  />
                </div>
                <div className="admin-field">
                  <label>Base Price ($)</label>
                  <input
                    type="number"
                    value={style.basePrice}
                    onChange={e => updateStyle(idx, 'basePrice', Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="admin-list-group">
                <div className="admin-list-col">
                  <label>Pros</label>
                  {style.pros.map((p, pi) => (
                    <div key={pi} className="admin-list-row">
                      <input
                        value={p}
                        onChange={e => updateListItem(idx, 'pros', pi, e.target.value)}
                      />
                      <button className="btn-remove" onClick={() => removeListItem(idx, 'pros', pi)}>✕</button>
                    </div>
                  ))}
                  <button className="btn-add-item" onClick={() => addListItem(idx, 'pros')}>+ Add Pro</button>
                </div>
                <div className="admin-list-col">
                  <label>Cons</label>
                  {style.cons.map((c, ci) => (
                    <div key={ci} className="admin-list-row">
                      <input
                        value={c}
                        onChange={e => updateListItem(idx, 'cons', ci, e.target.value)}
                      />
                      <button className="btn-remove" onClick={() => removeListItem(idx, 'cons', ci)}>✕</button>
                    </div>
                  ))}
                  <button className="btn-add-item" onClick={() => addListItem(idx, 'cons')}>+ Add Con</button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
