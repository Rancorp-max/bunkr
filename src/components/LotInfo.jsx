// src/components/LotInfo.jsx
export default function LotInfo({ config, onChange, style }) {
  const isUnderground = style === 'underground'

  return (
    <div className="wizard-step">
      <div className="step-header">
        <span className="step-label">Step 2 of 5</span>
        <h2>Your Property</h2>
        <p>Tell us about your lot so we can tailor the estimate.</p>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>ZIP Code</label>
          <input
            type="text"
            placeholder="e.g. 78701"
            maxLength={5}
            value={config.zipCode || ''}
            onChange={(e) => onChange({ zipCode: e.target.value })}
          />
          <span className="hint">Used for regional labor cost adjustments</span>
        </div>

        <div className="form-group">
          <label>Lot Size</label>
          <select
            value={config.lotSize || ''}
            onChange={(e) => onChange({ lotSize: e.target.value })}
          >
            <option value="">Select lot size</option>
            <option value="small">Under 5,000 sq ft (Urban)</option>
            <option value="medium">5,000–15,000 sq ft (Suburban)</option>
            <option value="large">15,000–43,560 sq ft (½ acre)</option>
            <option value="acreage">1+ acre (Rural)</option>
          </select>
        </div>

        {isUnderground && (
          <div className="form-group">
            <label>Soil / Ground Type</label>
            <select
              value={config.soilType || ''}
              onChange={(e) => onChange({ soilType: e.target.value })}
            >
              <option value="">Select soil type</option>
              <option value="loose">Loose / Sandy — Easy digging</option>
              <option value="clay">Clay / Dense — Harder digging</option>
              <option value="rock">Rock / Bedrock — Requires blasting</option>
            </select>
            <span className="hint">Not sure? A geotechnical survey costs ~$500–$1,500</span>
          </div>
        )}

        {!isUnderground && (
          <div className="form-group">
            <label>Intended Location in Home</label>
            <select
              value={config.location || ''}
              onChange={(e) => onChange({ location: e.target.value })}
            >
              <option value="">Select location</option>
              <option value="basement">Existing basement room</option>
              <option value="firstfloor">First floor interior room</option>
              <option value="garage">Attached garage</option>
            </select>
          </div>
        )}

        <div className="form-group">
          <label>Home Type</label>
          <select
            value={config.homeType || ''}
            onChange={(e) => onChange({ homeType: e.target.value })}
          >
            <option value="">Select home type</option>
            <option value="slab">Slab foundation</option>
            <option value="crawl">Crawl space</option>
            <option value="basement">Full basement</option>
            <option value="mobile">Mobile / manufactured home</option>
          </select>
        </div>

        <div className="form-group">
          <label>HOA Restrictions?</label>
          <div className="radio-group">
            {['Yes', 'No', 'Not sure'].map((v) => (
              <label key={v} className="radio-label">
                <input
                  type="radio"
                  name="hoa"
                  value={v.toLowerCase().replace(' ', '_')}
                  checked={config.hoa === v.toLowerCase().replace(' ', '_')}
                  onChange={(e) => onChange({ hoa: e.target.value })}
                />
                {v}
              </label>
            ))}
          </div>
          <span className="hint">HOA approval may add 2–6 weeks to planning phase</span>
        </div>
      </div>
    </div>
  )
}
