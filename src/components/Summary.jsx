// src/components/Summary.jsx

function calcCost(style, config, styles, costFactors) {
  const factors = costFactors?.[style] || {}
  const styleData = (styles || []).find((s) => s.id === style)
  if (!styleData) return { total: 0, items: [] }
  const base = styleData.basePrice || 0

  const sizeMult = config.size ? (factors.size?.[config.size]?.multiplier || 1.0) : 1.0
  let total = base * sizeMult

  if (style === 'underground') {
    if (config.soilType) total += factors.soilType?.[config.soilType]?.adder || 0
    if (config.depth) total += factors.depth?.[config.depth]?.adder || 0
    if (config.access) total += factors.access?.[config.access]?.adder || 0
  } else {
    if (config.wallType) total += factors.wallType?.[config.wallType]?.adder || 0
    if (config.location) total += factors.location?.[config.location]?.adder || 0
    if (config.door) total += factors.door?.[config.door]?.adder || 0
  }

  const amenities = config.amenities || []
  let amenityTotal = 0
  amenities.forEach((key) => { amenityTotal += factors.amenities?.[key]?.adder || 0 })
  total += amenityTotal

  const regionMult = config.zipCode ? getRegionMultiplier(config.zipCode) : 1.0
  total *= regionMult

  const items = []
  items.push({
    label: `Base ${styleData.name} (${config.size || '—'} sq ft)`,
    amount: Math.round(base * sizeMult),
    category: 'structure',
  })

  if (style === 'underground') {
    if (config.soilType && (factors.soilType?.[config.soilType]?.adder || 0) > 0) {
      items.push({ label: `Soil type: ${factors.soilType[config.soilType].label}`, amount: factors.soilType[config.soilType].adder, category: 'excavation' })
    }
    if (config.depth && (factors.depth?.[config.depth]?.adder || 0) > 0) {
      items.push({ label: `Depth: ${factors.depth[config.depth].label}`, amount: factors.depth[config.depth].adder, category: 'excavation' })
    }
    if (config.access && factors.access?.[config.access]) {
      items.push({ label: `Entry: ${factors.access[config.access].label}`, amount: factors.access[config.access].adder, category: 'access' })
    }
  } else {
    if (config.wallType && factors.wallType?.[config.wallType]) {
      items.push({ label: `Walls: ${factors.wallType[config.wallType].label}`, amount: factors.wallType[config.wallType].adder, category: 'structure' })
    }
    if (config.door && factors.door?.[config.door]) {
      items.push({ label: `Door: ${factors.door[config.door].label}`, amount: factors.door[config.door].adder, category: 'access' })
    }
  }

  amenities.forEach((key) => {
    if (factors.amenities?.[key]) {
      items.push({ label: factors.amenities[key].label, amount: factors.amenities[key].adder, category: 'systems' })
    }
  })

  if (regionMult !== 1.0) {
    const regionAdder = Math.round(total - total / regionMult)
    items.push({ label: 'Regional labor adjustment', amount: regionAdder, category: 'labor' })
  }

  return { total: Math.round(total), items, regionMult }
}

function getRegionMultiplier(zip) {
  const first = parseInt(zip?.substring(0, 3) || '0')
  if (first >= 100 && first <= 149) return 1.35
  if (first >= 900 && first <= 961) return 1.28
  if (first >= 980 && first <= 994) return 1.22
  if (first >= 600 && first <= 649) return 1.1
  if (first >= 200 && first <= 230) return 1.18
  if (first >= 750 && first <= 799) return 0.9
  if (first >= 350 && first <= 399) return 0.88
  return 1.0
}

const CATEGORY_COLORS = {
  structure: '#c8a96e',
  excavation: '#e07b54',
  access: '#6b9fd4',
  systems: '#7ec8a0',
  labor: '#b0b0b0',
}

const DIY_LABEL = (v) => {
  if (v === true || v === 'true') return 'DIY OK'
  if (v === false || v === 'false') return 'Pro Required'
  return 'Partial DIY'
}

export default function Summary({ config, style, onSave, saving, saveId, styles, costFactors, workPhases }) {
  const styleData = (styles || []).find((s) => s.id === style)
  const { total, items } = calcCost(style, config, styles, costFactors)
  const low = Math.round(total * 0.9)
  const high = Math.round(total * 1.2)
  const phases = workPhases?.[style] || []

  return (
    <div className="summary-page">
      <div className="step-header">
        <span className="step-label">Step 5 of 5</span>
        <h2>Your Bunker Estimate</h2>
        <p>
          {styleData?.name} · {config.size || '—'} sq ft · {config.capacity || '—'} occupants
        </p>
      </div>

      <div className="cost-banner">
        <div className="cost-label">Estimated Project Cost</div>
        <div className="cost-range">
          <span className="cost-low">${low.toLocaleString()}</span>
          <span className="cost-dash">–</span>
          <span className="cost-high">${high.toLocaleString()}</span>
        </div>
        <div className="cost-note">±10–20% variance based on contractor bids, material prices, and site conditions</div>
      </div>

      <div className="section">
        <h3>Cost Breakdown</h3>
        <div className="line-items">
          {items.map((item, i) => (
            <div key={i} className="line-item">
              <div className="line-dot" style={{ background: CATEGORY_COLORS[item.category] }} />
              <span className="line-label">{item.label}</span>
              <span className="line-amount">{item.amount === 0 ? 'Included' : `$${item.amount.toLocaleString()}`}</span>
            </div>
          ))}
          <div className="line-item total-row">
            <div className="line-dot" />
            <span className="line-label">Estimated Total</span>
            <span className="line-amount total">${total.toLocaleString()}</span>
          </div>
        </div>
        <div className="legend">
          {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
            <span key={cat} className="legend-item">
              <span className="legend-dot" style={{ background: color }} />
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </span>
          ))}
        </div>
      </div>

      <div className="section">
        <h3>Work Overview</h3>
        <p className="section-sub">Estimated timeline: <strong>{phases.length}–{phases.length * 2} months total</strong></p>
        <div className="phases">
          {phases.map((phase, i) => (
            <div key={i} className="phase-card">
              <div className="phase-header">
                <div className="phase-num">{i + 1}</div>
                <div className="phase-meta">
                  <span className="phase-name">{phase.phase}</span>
                  <span className="phase-duration">{phase.duration}</span>
                </div>
                <div className={`phase-diy diy-${phase.diy === true || phase.diy === 'true' ? 'yes' : phase.diy === false || phase.diy === 'false' ? 'no' : 'partial'}`}>
                  {DIY_LABEL(phase.diy)}
                </div>
              </div>
              <ul className="phase-tasks">
                {(phase.tasks || []).map((t, j) => <li key={j}>{t}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="disclaimer">
        <strong>Disclaimer:</strong> These estimates are for planning purposes only. Actual costs vary significantly by region, contractor, soil conditions, and permit requirements. Always obtain at least 3 contractor bids. Consult a licensed structural engineer before breaking ground.
      </div>

      <div className="save-row">
        {saveId ? (
          <div className="save-success">✓ Saved! Reference ID: <code>{saveId}</code></div>
        ) : (
          <button className="btn-save" onClick={onSave} disabled={saving}>
            {saving ? 'Saving…' : '💾 Save This Configuration'}
          </button>
        )}
      </div>
    </div>
  )
}
