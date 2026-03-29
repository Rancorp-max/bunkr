// src/components/Amenities.jsx
export default function Amenities({ config, onChange, style, costFactors }) {
  const amenities = costFactors?.[style]?.amenities || {}
  const selected = config.amenities || []

  const toggle = (key) => {
    const next = selected.includes(key)
      ? selected.filter((k) => k !== key)
      : [...selected, key]
    onChange({ amenities: next })
  }

  return (
    <div className="wizard-step">
      <div className="step-header">
        <span className="step-label">Step 4 of 5</span>
        <h2>Systems & Amenities</h2>
        <p>Select the systems you want included. Each adds to the cost estimate.</p>
      </div>

      <div className="amenity-grid">
        {Object.entries(amenities).map(([key, data]) => {
          const isOn = selected.includes(key)
          return (
            <button
              key={key}
              type="button"
              className={`amenity-card ${isOn ? 'active' : ''}`}
              onClick={() => toggle(key)}
            >
              <div className="amenity-top">
                <span className="amenity-name">{data.label}</span>
                <span className={`amenity-toggle ${isOn ? 'on' : 'off'}`}>
                  {isOn ? 'ON' : 'OFF'}
                </span>
              </div>
              <div className="amenity-price">
                +${data.adder?.toLocaleString()}
              </div>
            </button>
          )
        })}
      </div>

      <div className="amenity-note">
        <span>💡</span>
        <p>
          For stays longer than 2 weeks, FEMA recommends at minimum: filtered ventilation,
          water storage, and a backup power source.
        </p>
      </div>
    </div>
  )
}
