const wizardSteps = [
  { title: "Origins", description: "Choose ancestry and cultural expertises." },
  { title: "Starting Path", description: "Select a heroic path and key talent." },
  { title: "Attributes", description: "Allocate points across six attributes." },
  { title: "Skills & Expertises", description: "Assign ranks and apply bonuses." },
  { title: "Talents", description: "Pick talents and confirm prerequisites." },
  { title: "Equipment", description: "Choose a starting kit and gear." },
  { title: "Story Metadata", description: "Define purpose, goals, and notes." },
  { title: "Final Audit", description: "Review validation results and citations." }
];

const stats = [
  { label: "Defense", value: "Resolve 10 / Physical 12 / Spiritual 9" },
  { label: "Resources", value: "Health 12 • Focus 6 • Investiture 0" },
  { label: "Recovery", value: "d6, 2/day" }
];

export default function App() {
  return (
    <div className="app">
      <header className="hero">
        <div>
          <p className="eyebrow">Tempest Illumination</p>
          <h1>Stormlight RPG Character Creator</h1>
          <p className="subtitle">
            Build characters step-by-step with rules-aware validation, citations, and radiant
            progression tracking.
          </p>
          <div className="hero-actions">
            <button className="primary">Start new character</button>
            <button className="ghost">Load existing sheet</button>
          </div>
        </div>
        <div className="hero-panel">
          <h2>Current Draft</h2>
          <p className="panel-subtitle">Kaladin Stormblessed • Level 1</p>
          <div className="panel-grid">
            <div>
              <span className="label">Ancestry</span>
              <strong>Human</strong>
            </div>
            <div>
              <span className="label">Path</span>
              <strong>Warrior</strong>
            </div>
            <div>
              <span className="label">Order</span>
              <strong>Windrunner (pending)</strong>
            </div>
            <div>
              <span className="label">Status</span>
              <strong>Draft</strong>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="section">
          <div className="section-header">
            <div>
              <h2>Creation Wizard</h2>
              <p>Eight guided steps keep every choice rules legal.</p>
            </div>
            <button className="link">Open wizard</button>
          </div>
          <div className="card-grid">
            {wizardSteps.map((step, index) => (
              <article className="card" key={step.title}>
                <div className="card-header">
                  <span className="step-index">Step {index + 1}</span>
                  <h3>{step.title}</h3>
                </div>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <div>
              <h2>Character Sheet Preview</h2>
              <p>Live derived values update as choices change.</p>
            </div>
            <button className="link">Open sheet</button>
          </div>
          <div className="sheet-grid">
            {stats.map((stat) => (
              <div className="sheet-card" key={stat.label}>
                <span className="label">{stat.label}</span>
                <strong>{stat.value}</strong>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
