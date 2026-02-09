import { useState } from "react";
import {
  ancestries,
  culturalExpertises
} from "./data/stormlightPack";
import type { CharacterState } from "./models";

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
  const [currentStep, setCurrentStep] = useState<"origin" | "origins">("origin");
  const [originStep, setOriginStep] = useState<"ancestry" | "details">("ancestry");

  const selectedAncestry = ancestries.find((ancestry) => ancestry.id === state.ancestryKey);

  const isSinger = selectedAncestry?.id === "sl.ancestry.singer";
  const isHuman = selectedAncestry?.id === "sl.ancestry.human";

  const visibleCultures = culturalExpertises.filter((culture) => {
    if (!culture.allowedAncestries) {
      return true;
    }
    if (!selectedAncestry) {
      return true;
    }
    return culture.allowedAncestries.includes(selectedAncestry.id);
  });

  const handleAncestryChange = (value: string) => {
    setState((prev) => ({
      ...prev,
      ancestryKey: value || undefined,
      cultureKeys: value === "sl.ancestry.human" ? prev.cultureKeys : []
    }));
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

  const handleReset = () => {
    setState(initialState);
    setOriginStep("ancestry");
  };

  const handleStartNewCharacter = () => {
    handleReset();
    setCurrentStep("origins");
  };

  return (
    <div className="app">
      {currentStep === "origin" ? (
        <main className="origin-landing">
          <div className="origin-card">
            <p className="eyebrow">Choose your origin</p>
            <h1>Stormlight RPG Character Creator</h1>
            <p className="subtitle">
              Start a new character or bring in an existing sheet. We will build the rest step by
              step.
            </p>
            <div className="hero-actions">
              <button className="primary" onClick={handleStartNewCharacter} type="button">
                Start new character
              </button>
              <button className="ghost" type="button">
                Load existing sheet
              </button>
            </div>
          </div>
        </main>
      ) : (
        <main className="modal-backdrop">
          <section className="origin-modal">
            <div className="origin-step">
              <div className="card-header">
                <span className="step-index">Step 1</span>
                <h2>Choose your ancestry</h2>
              </div>
              <article className="form-card">
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
                <div className="origin-actions">
                  <button
                    className="primary"
                    type="button"
                    onClick={() => setOriginStep("details")}
                    disabled={!state.ancestryKey}
                  >
                    Next: Culture &amp; forms
                  </button>
                </div>
              </article>
            </div>

            {originStep === "details" && (
              <div className="origin-step">
                <div className="card-header">
                  <span className="step-index">Step 2</span>
                  <h2>Culture &amp; forms</h2>
                </div>
                <div className="origin-layout">
                  <article className="form-card">
                    {isSinger ? (
                      <div className="field-group">
                        <div className="callout">
                          <strong>Singers &amp; forms</strong>
                          <p>
                            Singers do not select cultural expertises. Instead, they gain forms and
                            the ability to change forms over time.
                          </p>
                        </div>
                        <ul className="benefit-list">
                          <li>
                            <strong>Unique Talent Tree (Level 1).</strong> Whenever you choose a new
                            talent, you can choose it from the Singer talent tree in this chapter
                            (in addition to the other trees you have access to).
                          </li>
                          <li>
                            <strong>Change Form (Level 1).</strong> You gain the Change Form (Singer
                            Key) talent from the Singer tree, along with one bonus talent that’s
                            connected to it. Decide which form to begin the game in, choosing from
                            the forms in these two talents. As you gain levels, you can learn new
                            forms from talents in the Singer tree.
                          </li>
                          <li>
                            <strong>Ancestry Bonus Talents (Level 6, 11, 16, and 21).</strong> Each
                            time you reach a new tier (as indicated on the Character Advancement
                            table in chapter 1), you again gain a bonus talent. You must choose it
                            from the tree or from any heroic path (see chapter 4).
                          </li>
                        </ul>
                      </div>
                    ) : (
                      <div className="field-group">
                        <div className="field-row">
                          <label className="field-label">Cultural expertises</label>
                          <span className="field-meta">{state.cultureKeys.length}/2 selected</span>
                        </div>
                        <div className="callout">
                          <p>
                            Your character’s culture isn’t determined by birth or any other single
                            moment in time. Instead, cultural awareness can be shaped by
                            nationality, ethnicity, migration, traveling experience, and more.
                          </p>
                          <span className="field-meta">Player Handbook p. 38</span>
                        </div>
                        {!isHuman && (
                          <p className="field-hint">Select a human ancestry to choose cultures.</p>
                        )}
                        <div className="option-grid">
                          {visibleCultures.map((culture) => {
                            const checked = state.cultureKeys.includes(culture.id);
                            const ancestryAllowed =
                              !culture.allowedAncestries ||
                              (selectedAncestry &&
                                culture.allowedAncestries.includes(selectedAncestry.id));
                            const disabled =
                              !isHuman ||
                              !ancestryAllowed ||
                              (!checked && state.cultureKeys.length >= 2);
                            return (
                              <label
                                key={culture.id}
                                className={`option-card${disabled ? " disabled" : ""}`}
                              >
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
                    )}
                  </article>

                  <aside className="origin-aside">
                    <div className="sidebar-card">
                      <h3>Origin artwork</h3>
                      <div className="portrait-grid">
                        <div className="portrait-card">
                          <span className="label">Human cultures</span>
                          <p>{isHuman ? "Ready for human culture art." : "Select a human culture."}</p>
                        </div>
                        <div className="portrait-card">
                          <span className="label">Singer forms</span>
                          <p>{isSinger ? "Ready for singer form art." : "Select singer ancestry."}</p>
                        </div>
                      </div>
                    </div>
                  </aside>
                </div>
              </div>
            )}
          </section>
        </main>
      )}
    </div>
  );
}
