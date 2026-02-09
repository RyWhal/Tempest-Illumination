import { useMemo, useState } from "react";
import {
  ancestries,
  culturalExpertises,
  heroicPaths,
  items,
  kits,
  skills,
  talents
} from "./data/stormlightPack";
import type { CharacterState } from "./models";
import { computeDerivedStats, validateAudit } from "./wizard/steps";

const attributeList = [
  { key: "strength", label: "Strength" },
  { key: "speed", label: "Speed" },
  { key: "intellect", label: "Intellect" },
  { key: "willpower", label: "Willpower" },
  { key: "awareness", label: "Awareness" },
  { key: "presence", label: "Presence" }
] as const;

type AttributeKey = (typeof attributeList)[number]["key"];

const emptyAttributes = attributeList.reduce<Record<AttributeKey, number>>(
  (acc, { key }) => {
    acc[key] = 0;
    return acc;
  },
  {} as Record<AttributeKey, number>
);

const initialState: CharacterState = {
  level: 1,
  ancestryKey: undefined,
  cultureKeys: [],
  pathKey: undefined,
  attributes: emptyAttributes,
  skills: {},
  expertises: [],
  talents: [],
  inventory: [],
  identity: {
    name: "",
    playerName: "",
    purpose: "",
    obstacle: "",
    goals: [],
    notes: ""
  }
};

export default function App() {
  const [state, setState] = useState<CharacterState>(initialState);
  const [bonusTalentId, setBonusTalentId] = useState<string>("");
  const [kitId, setKitId] = useState<string>("");
  const [goalDraft, setGoalDraft] = useState("");

  const selectedAncestry = ancestries.find((ancestry) => ancestry.id === state.ancestryKey);
  const selectedPath = heroicPaths.find((path) => path.id === state.pathKey);
  const selectedCultures = culturalExpertises.filter((culture) =>
    state.cultureKeys.includes(culture.id)
  );
  const selectedKit = kits.find((kit) => kit.id === kitId);

  const derivedTalents = useMemo(() => {
    const list = new Set<string>();
    if (selectedPath?.keyTalentId) {
      list.add(selectedPath.keyTalentId);
    }
    if (selectedAncestry?.id === "sl.ancestry.singer") {
      list.add("sl.talent.singer.change_form_key");
    }
    if (selectedAncestry?.id === "sl.ancestry.human" && bonusTalentId) {
      list.add(bonusTalentId);
    }
    return Array.from(list);
  }, [bonusTalentId, selectedAncestry?.id, selectedPath?.keyTalentId]);

  const validationState = useMemo(
    () => ({
      ...state,
      talents: derivedTalents,
      inventory: state.inventory
    }),
    [derivedTalents, state]
  );
  const auditIssues = useMemo(() => validateAudit(validationState), [validationState]);
  const derivedStats = useMemo(() => computeDerivedStats(validationState), [validationState]);

  const totalAttributes = attributeList.reduce(
    (total, { key }) => total + (state.attributes[key] ?? 0),
    0
  );

  const selectedSkills = skills.map((skill) => ({
    ...skill,
    rank: state.skills[skill.id] ?? 0
  }));

  const availableTalents = talents.filter(
    (talent) => talent.subtype === "heroic_key" || talent.subtype === "radiant_key"
  );

  const displayedTalents = derivedTalents
    .map((id) => talents.find((talent) => talent.id === id))
    .filter(Boolean);

  const inventoryItems = state.inventory
    .map((itemId) => items.find((item) => item.id === itemId)?.name ?? itemId)
    .filter(Boolean);

  const handleAncestryChange = (value: string) => {
    setState((prev) => ({
      ...prev,
      ancestryKey: value || undefined
    }));
    if (!value) {
      setBonusTalentId("");
    }
  };

  const handleCultureToggle = (cultureId: string) => {
    setState((prev) => {
      const alreadySelected = prev.cultureKeys.includes(cultureId);
      if (alreadySelected) {
        return { ...prev, cultureKeys: prev.cultureKeys.filter((id) => id !== cultureId) };
      }
      if (prev.cultureKeys.length >= 2) {
        return prev;
      }
      return { ...prev, cultureKeys: [...prev.cultureKeys, cultureId] };
    });
  };

  const handlePathChange = (value: string) => {
    setState((prev) => ({
      ...prev,
      pathKey: value || undefined
    }));
  };

  const handleAttributeChange = (key: AttributeKey, value: number) => {
    setState((prev) => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [key]: Number.isNaN(value) ? 0 : value
      }
    }));
  };

  const handleSkillChange = (skillId: string, value: number) => {
    setState((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [skillId]: Number.isNaN(value) ? 0 : value
      }
    }));
  };

  const handleKitChange = (value: string) => {
    setKitId(value);
    const kit = kits.find((entry) => entry.id === value);
    if (!kit) {
      setState((prev) => ({ ...prev, inventory: [] }));
      return;
    }
    const newItems = kit.grants
      .filter((grant) => grant.type === "item")
      .map((grant) => grant.target);
    setState((prev) => ({ ...prev, inventory: newItems }));
  };

  const handleGoalAdd = () => {
    if (!goalDraft.trim()) {
      return;
    }
    setState((prev) => ({
      ...prev,
      identity: {
        ...prev.identity,
        goals: [...prev.identity.goals, goalDraft.trim()]
      }
    }));
    setGoalDraft("");
  };

  const handleGoalRemove = (goal: string) => {
    setState((prev) => ({
      ...prev,
      identity: {
        ...prev.identity,
        goals: prev.identity.goals.filter((entry) => entry !== goal)
      }
    }));
  };

  const handleReset = () => {
    setState(initialState);
    setBonusTalentId("");
    setKitId("");
    setGoalDraft("");
  };

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
            <button className="primary" onClick={handleReset} type="button">
              Start new character
            </button>
            <button className="ghost" type="button">
              Load existing sheet
            </button>
          </div>
        </div>
        <div className="hero-panel">
          <h2>Current Draft</h2>
          <p className="panel-subtitle">
            {state.identity.name || "Unnamed hero"} • Level {state.level}
          </p>
          <div className="panel-grid">
            <div>
              <span className="label">Ancestry</span>
              <strong>{selectedAncestry?.name ?? "Unassigned"}</strong>
            </div>
            <div>
              <span className="label">Path</span>
              <strong>{selectedPath?.name ?? "Unassigned"}</strong>
            </div>
            <div>
              <span className="label">Order</span>
              <strong>Windrunner (pending)</strong>
            </div>
            <div>
              <span className="label">Status</span>
              <strong>{auditIssues.length === 0 ? "Ready" : "Draft"}</strong>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="section">
          <div className="section-header">
            <div>
              <h2>Interactive Creation</h2>
              <p>Make live selections from the Stormlight data pack and see validation updates.</p>
            </div>
            <button className="link" type="button">
              Open wizard
            </button>
          </div>
          <div className="interactive-grid">
            <div className="interactive-column">
              <article className="form-card">
                <div className="card-header">
                  <span className="step-index">Step 1</span>
                  <h3>Origins</h3>
                </div>
                <div className="field-group">
                  <label className="field-label" htmlFor="ancestry-select">
                    Ancestry
                  </label>
                  <select
                    id="ancestry-select"
                    value={state.ancestryKey ?? ""}
                    onChange={(event) => handleAncestryChange(event.target.value)}
                  >
                    <option value="">Select ancestry</option>
                    {ancestries.map((ancestry) => (
                      <option key={ancestry.id} value={ancestry.id}>
                        {ancestry.name}
                      </option>
                    ))}
                  </select>
                  {selectedAncestry && (
                    <p className="field-hint">
                      {selectedAncestry.rulesText} (p. {selectedAncestry.source.page})
                    </p>
                  )}
                </div>
                <div className="field-group">
                  <div className="field-row">
                    <label className="field-label">Cultural expertises</label>
                    <span className="field-meta">{state.cultureKeys.length}/2 selected</span>
                  </div>
                  <div className="option-grid">
                    {culturalExpertises.map((culture) => {
                      const checked = state.cultureKeys.includes(culture.id);
                      const disabled = !checked && state.cultureKeys.length >= 2;
                      return (
                        <label key={culture.id} className={`option-card${disabled ? " disabled" : ""}`}>
                          <input
                            type="checkbox"
                            checked={checked}
                            disabled={disabled}
                            onChange={() => handleCultureToggle(culture.id)}
                          />
                          <span>
                            <strong>{culture.name}</strong>
                            <span>{culture.rulesText}</span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </article>

              <article className="form-card">
                <div className="card-header">
                  <span className="step-index">Step 2</span>
                  <h3>Starting Path</h3>
                </div>
                <div className="option-grid">
                  {heroicPaths.map((path) => (
                    <label
                      key={path.id}
                      className={`option-card${state.pathKey === path.id ? " active" : ""}`}
                    >
                      <input
                        type="radio"
                        name="heroic-path"
                        value={path.id}
                        checked={state.pathKey === path.id}
                        onChange={(event) => handlePathChange(event.target.value)}
                      />
                      <span>
                        <strong>{path.name}</strong>
                        <span>{path.theme}</span>
                        <em>Starting skill: {path.startingSkill}</em>
                      </span>
                    </label>
                  ))}
                </div>
              </article>

              <article className="form-card">
                <div className="card-header">
                  <span className="step-index">Step 3</span>
                  <h3>Attributes</h3>
                </div>
                <p className="field-hint">
                  Allocate points across six attributes. Total allocated: {totalAttributes}.
                </p>
                <div className="attribute-grid">
                  {attributeList.map(({ key, label }) => (
                    <label key={key} className="attribute-card">
                      <span>{label}</span>
                      <input
                        type="number"
                        min={0}
                        max={6}
                        value={state.attributes[key] ?? 0}
                        onChange={(event) =>
                          handleAttributeChange(key, Number(event.target.value))
                        }
                      />
                    </label>
                  ))}
                </div>
              </article>

              <article className="form-card">
                <div className="card-header">
                  <span className="step-index">Step 4</span>
                  <h3>Skills &amp; Expertises</h3>
                </div>
                <div className="skill-grid">
                  {selectedSkills.map((skill) => (
                    <label key={skill.id} className="skill-row">
                      <span>
                        <strong>{skill.name}</strong>
                        <span>
                          {skill.category} • {skill.attribute}
                        </span>
                      </span>
                      <input
                        type="number"
                        min={0}
                        max={2}
                        value={skill.rank}
                        onChange={(event) => handleSkillChange(skill.id, Number(event.target.value))}
                      />
                    </label>
                  ))}
                </div>
              </article>

              <article className="form-card">
                <div className="card-header">
                  <span className="step-index">Step 5</span>
                  <h3>Talents</h3>
                </div>
                <div className="talent-summary">
                  {displayedTalents.length === 0 ? (
                    <p className="field-hint">Key talents will appear here based on ancestry and path.</p>
                  ) : (
                    displayedTalents.map((talent) =>
                      talent ? (
                        <div key={talent.id} className="talent-card">
                          <strong>{talent.name}</strong>
                          <span>{talent.rulesText}</span>
                        </div>
                      ) : null
                    )
                  )}
                </div>
                {selectedAncestry?.id === "sl.ancestry.human" && (
                  <div className="field-group">
                    <label className="field-label" htmlFor="bonus-talent-select">
                      Human bonus talent
                    </label>
                    <select
                      id="bonus-talent-select"
                      value={bonusTalentId}
                      onChange={(event) => setBonusTalentId(event.target.value)}
                    >
                      <option value="">Select bonus talent</option>
                      {availableTalents.map((talent) => (
                        <option key={talent.id} value={talent.id}>
                          {talent.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </article>

              <article className="form-card">
                <div className="card-header">
                  <span className="step-index">Step 6</span>
                  <h3>Equipment</h3>
                </div>
                <div className="field-group">
                  <label className="field-label" htmlFor="kit-select">
                    Starting kit
                  </label>
                  <select
                    id="kit-select"
                    value={kitId}
                    onChange={(event) => handleKitChange(event.target.value)}
                  >
                    <option value="">Select kit</option>
                    {kits.map((kit) => (
                      <option key={kit.id} value={kit.id}>
                        {kit.name}
                      </option>
                    ))}
                  </select>
                  {selectedKit && <p className="field-hint">{selectedKit.rulesText}</p>}
                </div>
                <div className="inventory-list">
                  {inventoryItems.length === 0 ? (
                    <p className="field-hint">Select a kit to populate inventory.</p>
                  ) : (
                    inventoryItems.map((item) => <span key={item}>{item}</span>)
                  )}
                </div>
              </article>

              <article className="form-card">
                <div className="card-header">
                  <span className="step-index">Step 7</span>
                  <h3>Story Metadata</h3>
                </div>
                <div className="field-group">
                  <label className="field-label" htmlFor="name-input">
                    Character name
                  </label>
                  <input
                    id="name-input"
                    type="text"
                    value={state.identity.name}
                    onChange={(event) =>
                      setState((prev) => ({
                        ...prev,
                        identity: { ...prev.identity, name: event.target.value }
                      }))
                    }
                  />
                </div>
                <div className="field-group">
                  <label className="field-label" htmlFor="purpose-input">
                    Purpose
                  </label>
                  <input
                    id="purpose-input"
                    type="text"
                    value={state.identity.purpose}
                    onChange={(event) =>
                      setState((prev) => ({
                        ...prev,
                        identity: { ...prev.identity, purpose: event.target.value }
                      }))
                    }
                  />
                </div>
                <div className="field-group">
                  <label className="field-label" htmlFor="obstacle-input">
                    Obstacle
                  </label>
                  <input
                    id="obstacle-input"
                    type="text"
                    value={state.identity.obstacle}
                    onChange={(event) =>
                      setState((prev) => ({
                        ...prev,
                        identity: { ...prev.identity, obstacle: event.target.value }
                      }))
                    }
                  />
                </div>
                <div className="field-group">
                  <label className="field-label">Goals</label>
                  <div className="goal-input">
                    <input
                      type="text"
                      placeholder="Add a goal"
                      value={goalDraft}
                      onChange={(event) => setGoalDraft(event.target.value)}
                    />
                    <button type="button" className="ghost small" onClick={handleGoalAdd}>
                      Add
                    </button>
                  </div>
                  <div className="goal-list">
                    {state.identity.goals.length === 0 ? (
                      <span className="field-hint">No goals yet.</span>
                    ) : (
                      state.identity.goals.map((goal) => (
                        <button
                          key={goal}
                          type="button"
                          className="goal-pill"
                          onClick={() => handleGoalRemove(goal)}
                        >
                          {goal} ×
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </article>
            </div>

            <aside className="interactive-sidebar">
              <article className="sidebar-card">
                <h3>Validation Audit</h3>
                {auditIssues.length === 0 ? (
                  <p className="field-hint">All checks passed. Ready for final review.</p>
                ) : (
                  <ul className="audit-list">
                    {auditIssues.map((issue, index) => (
                      <li key={`${issue.message}-${index}`} className={issue.severity}>
                        <strong>{issue.severity.toUpperCase()}</strong> {issue.message}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
              <article className="sidebar-card">
                <h3>Derived Snapshot</h3>
                <div className="stat-row">
                  <span>Resolve</span>
                  <strong>{derivedStats.defenses.resolve ?? 0}</strong>
                </div>
                <div className="stat-row">
                  <span>Movement</span>
                  <strong>{derivedStats.movement} squares</strong>
                </div>
                <div className="stat-row">
                  <span>Recovery</span>
                  <strong>{derivedStats.recoveryDie}</strong>
                </div>
                <div className="stat-row">
                  <span>Resources</span>
                  <strong>
                    {Object.entries(derivedStats.resources)
                      .map(([key, value]) => `${key}: ${value}`)
                      .join(" • ")}
                  </strong>
                </div>
              </article>
              <article className="sidebar-card">
                <h3>Selections</h3>
                <div className="summary-group">
                  <span className="label">Cultures</span>
                  <p>
                    {selectedCultures.length > 0
                      ? selectedCultures.map((culture) => culture.name).join(", ")
                      : "None"}
                  </p>
                </div>
                <div className="summary-group">
                  <span className="label">Talents</span>
                  <p>
                    {displayedTalents.length > 0
                      ? displayedTalents.map((talent) => talent?.name).join(", ")
                      : "None"}
                  </p>
                </div>
                <div className="summary-group">
                  <span className="label">Inventory</span>
                  <p>{inventoryItems.length > 0 ? inventoryItems.join(", ") : "None"}</p>
                </div>
              </article>
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
}
