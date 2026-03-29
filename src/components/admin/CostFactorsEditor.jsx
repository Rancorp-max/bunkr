// src/components/admin/CostFactorsEditor.jsx
import { useState } from 'react'

const FIELD_META = {
  underground: {
    size:     { label: 'Sizes', valueType: 'multiplier', hint: 'Multiplies the base price' },
    soilType: { label: 'Soil Types', valueType: 'adder', hint: 'Added to base cost' },
    depth:    { label: 'Burial Depth', valueType: 'adder', hint: 'Added to base cost' },
    access:   { label: 'Entry / Access', valueType: 'adder', hint: 'Added to base cost' },
  },
  saferoom: {
    size:     { label: 'Sizes', valueType: 'multiplier', hint: 'Multiplies the base price' },
    wallType: { label: 'Wall Types', valueType: 'adder', hint: 'Added to base cost' },
    location: { label: 'Room Location', valueType: 'adder', hint: 'Added to base cost' },
    door:     { label: 'Door Types', valueType: 'adder', hint: 'Added to base cost' },
  },
}

function OptionTable({ styleId, groupKey, options, meta, onChange }) {
  const valueField = meta.valueType

  const updateOption = (key, field, value) => {
    onChange({
      ...options,
      [key]: { ...options[key], [field]: field === 'label' ? value : Number(value) },
    })
  }

  const addOption = () => {
    const key = `option_${Date.now()}`
    onChange({
      ...options,
      [key]: { label: 'New option', [valueField]: 0 },
    })
  }

  const removeOption = (key) => {
    const next = { ...options }
    delete next[key]
    onChange(next)
  }

  return (
    <div className="option-table-wrap">
      <div className="option-table-hint">{meta.hint}</div>
      <table className="option-table">
        <thead>
          <tr>
            <th>Key</th>
            <th>Label</th>
            <th>{valueField === 'multiplier' ? 'Multiplier' : 'Adder ($)'}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(options).map(([key, val]) => (
            <tr key={key}>
              <td><code className="key-badge">{key}</code></td>
              <td>
                <input
                  value={val.label}
                  onChange={e => updateOption(key, 'label', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  step={valueField === 'multiplier' ? '0.1' : '100'}
                  value={val[valueField]}
                  onChange={e => updateOption(key, valueField, e.target.value)}
                  style={{ maxWidth: 100 }}
                />
              </td>
              <td>
                <button className="btn-remove" onClick={() => removeOption(key)}>✕</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn-add-item" onClick={addOption}>+ Add Option</button>
    </div>
  )
}

export default function CostFactorsEditor({ costFactors, onChange }) {
  const [activeStyle, setActiveStyle] = useState('underground')
  const [expandedGroup, setExpandedGroup] = useState(null)

  const updateGroup = (styleId, groupKey, newOptions) => {
    onChange({
      ...costFactors,
      [styleId]: {
        ...costFactors[styleId],
        [groupKey]: newOptions,
      },
    })
  }

  const meta = FIELD_META[activeStyle]
  const groups = costFactors[activeStyle]

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h2>Cost Factors</h2>
        <p>Edit the pricing options for Steps 3 of the wizard (Size, depth, walls, entry). Amenities are in their own tab.</p>
      </div>

      <div className="admin-tabs">
        {['underground', 'saferoom'].map(id => (
          <button
            key={id}
            className={`admin-tab ${activeStyle === id ? 'active' : ''}`}
            onClick={() => { setActiveStyle(id); setExpandedGroup(null) }}
          >
            {id === 'underground' ? '⛏ Underground' : '🏠 Safe Room'}
          </button>
        ))}
      </div>

      {Object.entries(meta).map(([groupKey, groupMeta]) => (
        <div key={groupKey} className="admin-card">
          <button
            className="admin-card-toggle"
            onClick={() => setExpandedGroup(expandedGroup === groupKey ? null : groupKey)}
          >
            <div className="admin-card-toggle-left">
              <span className="admin-card-title">{groupMeta.label}</span>
              <span className="admin-card-sub">
                {Object.keys(groups[groupKey] || {}).length} options
              </span>
            </div>
            <span className="admin-chevron">{expandedGroup === groupKey ? '▲' : '▼'}</span>
          </button>

          {expandedGroup === groupKey && (
            <div className="admin-card-body">
              <OptionTable
                styleId={activeStyle}
                groupKey={groupKey}
                options={groups[groupKey] || {}}
                meta={groupMeta}
                onChange={(newOptions) => updateGroup(activeStyle, groupKey, newOptions)}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
