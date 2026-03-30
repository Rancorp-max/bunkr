// src/components/admin/AmenitiesEditor.jsx
import { useState } from 'react'

export default function AmenitiesEditor({ costFactors, onChange }) {
  const [activeStyle, setActiveStyle] = useState('underground')

  const amenities = costFactors[activeStyle]?.amenities || {}

  const updateAmenity = (key, field, value) => {
    onChange({
      ...costFactors,
      [activeStyle]: {
        ...costFactors[activeStyle],
        amenities: {
          ...amenities,
          [key]: {
            ...amenities[key],
            [field]: field === 'adder' ? Number(value) : value,
          },
        },
      },
    })
  }

  const addAmenity = () => {
    const key = `amenity_${Date.now()}`
    onChange({
      ...costFactors,
      [activeStyle]: {
        ...costFactors[activeStyle],
        amenities: {
          ...amenities,
          [key]: { label: 'New amenity', adder: 0 },
        },
      },
    })
  }

  const removeAmenity = (key) => {
    const next = { ...amenities }
    delete next[key]
    onChange({
      ...costFactors,
      [activeStyle]: {
        ...costFactors[activeStyle],
        amenities: next,
      },
    })
  }

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h2>Amenities</h2>
        <p>Edit the toggle options shown on Step 4 of the wizard. Each amenity adds a fixed cost.</p>
      </div>

      <div className="admin-tabs">
        {['underground', 'saferoom'].map(id => (
          <button
            key={id}
            className={`admin-tab ${activeStyle === id ? 'active' : ''}`}
            onClick={() => setActiveStyle(id)}
          >
            {id === 'underground' ? '⛏ Underground' : '🏠 Safe Room'}
          </button>
        ))}
      </div>

      <div className="admin-card">
        <div className="admin-card-body">
          <table className="option-table">
            <thead>
              <tr>
                <th>Key</th>
                <th>Label</th>
                <th>Cost Adder ($)</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(amenities).map(([key, val]) => (
                <tr key={key}>
                  <td><code className="key-badge">{key}</code></td>
                  <td>
                    <input
                      value={val.label}
                      onChange={e => updateAmenity(key, 'label', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      step="100"
                      value={val.adder}
                      onChange={e => updateAmenity(key, 'adder', e.target.value)}
                      style={{ maxWidth: 110 }}
                    />
                  </td>
                  <td>
                    <button className="btn-remove" onClick={() => removeAmenity(key)}>✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn-add-item" onClick={addAmenity}>+ Add Amenity</button>
        </div>
      </div>
    </div>
  )
}
