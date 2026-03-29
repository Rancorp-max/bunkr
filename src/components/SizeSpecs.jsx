// src/components/SizeSpecs.jsx
export default function SizeSpecs({ config, onChange, style, costFactors }) {
  const factors = costFactors?.[style] || {}
  const sizes = Object.entries(factors.size || {})
  const isUnderground = style === 'underground'

  return (
    <div className="wizard-step">
      <div className="step-header">
        <span className="step-label">Step 3 of 5</span>
        <h2>Size & Structure</h2>
        <p>How large does your shelter need to be, and how should it be built?</p>
      </div>

      <div className="form-grid">
        <div className="form-group full-width">
          <label>Shelter Size</label>
          <div className="size-cards">
            {sizes.map(([sqft, data]) => (
              <button
                key={sqft}
                className={`size-card ${config.size === sqft ? 'active' : ''}`}
                onClick={() => onChange({ size: sqft })}
                type="button"
              >
                <span className="sqft">{sqft} sq ft</span>
                <span className="size-label">{data.label?.split('(')[1]?.replace(')', '') || data.label}</span>
                <span className="size-mult">×{data.multiplier} base cost</span>
              </button>
            ))}
          </div>
        </div>

        {isUnderground && (
          <div className="form-group">
            <label>Burial Depth</label>
            <select
              value={config.depth || ''}
              onChange={(e) => onChange({ depth: e.target.value })}
            >
              <option value="">Select depth</option>
              {Object.entries(factors.depth || {}).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
            <span className="hint">Deeper = more protection + higher cost</span>
          </div>
        )}

        {!isUnderground && (
          <div className="form-group">
            <label>Wall Construction Type</label>
            <select
              value={config.wallType || ''}
              onChange={(e) => onChange({ wallType: e.target.value })}
            >
              <option value="">Select wall type</option>
              {Object.entries(factors.wallType || {}).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </div>
        )}

        <div className="form-group">
          <label>{isUnderground ? 'Entry / Access' : 'Door Type'}</label>
          <select
            value={config[isUnderground ? 'access' : 'door'] || ''}
            onChange={(e) => onChange({ [isUnderground ? 'access' : 'door']: e.target.value })}
          >
            <option value="">Select option</option>
            {Object.entries(factors[isUnderground ? 'access' : 'door'] || {}).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Intended Capacity</label>
          <select
            value={config.capacity || ''}
            onChange={(e) => onChange({ capacity: e.target.value })}
          >
            <option value="">Select capacity</option>
            <option value="2">1–2 people</option>
            <option value="4">3–4 people (family)</option>
            <option value="8">5–8 people (extended family)</option>
            <option value="12">9–12 people</option>
          </select>
        </div>

        <div className="form-group">
          <label>Intended Duration of Stay</label>
          <select
            value={config.duration || ''}
            onChange={(e) => onChange({ duration: e.target.value })}
          >
            <option value="">Select duration</option>
            <option value="72hr">72 hours (short-term)</option>
            <option value="2weeks">2 weeks</option>
            <option value="3months">3 months</option>
            <option value="1year">1 year+</option>
          </select>
          <span className="hint">Longer stays require more systems and storage</span>
        </div>
      </div>
    </div>
  )
}
