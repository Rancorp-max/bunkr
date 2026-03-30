// src/components/StylePicker.jsx
export default function StylePicker({ selected, onSelect, styles = [] }) {
  return (
    <div className="style-picker">
      <div className="step-header">
        <span className="step-label">Step 1 of 5</span>
        <h2>Choose Your Shelter Type</h2>
        <p>Select the bunker style that fits your property and goals.</p>
      </div>

      <div className="style-cards">
        {styles.map((style) => (
          <button
            key={style.id}
            className={`style-card ${selected === style.id ? 'selected' : ''}`}
            onClick={() => onSelect(style.id)}
            style={{ '--card-bg': style.imageBg }}
          >
            <div className="card-inner">
              <div className="card-icon">{style.icon}</div>
              <div className="card-content">
                <h3>{style.name}</h3>
                <p className="tagline">{style.tagline}</p>
                <p className="desc">{style.description}</p>

                <div className="pros-cons">
                  <div className="pros">
                    {(style.pros || []).map((p) => (
                      <span key={p} className="tag pro">✓ {p}</span>
                    ))}
                  </div>
                  <div className="cons">
                    {(style.cons || []).map((c) => (
                      <span key={c} className="tag con">✗ {c}</span>
                    ))}
                  </div>
                </div>

                <div className="base-price">
                  Starting from <strong>${style.basePrice?.toLocaleString()}</strong>
                </div>
              </div>
            </div>
            {selected === style.id && <div className="selected-badge">Selected ✓</div>}
          </button>
        ))}
      </div>
    </div>
  )
}
