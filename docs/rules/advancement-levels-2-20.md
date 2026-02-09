# Advancement / Level-Up Rules (Levels 2–20)

## Rule summary table
| Area | Summary | Notes |
| --- | --- | --- |
| Level gains | Each level grants specific gains. | Skills, talents, and path features. |
| Skill rank caps | Enforce max rank by level. | Track total ranks gained. |
| Talent choices | Gain talents at defined milestones. | Enforce prerequisites. |
| Radiant unlocks | Radiant path gains are gated. | First Ideal and later ideals. |

## Dependencies / prerequisites graph
```mermaid
graph TD
  L[Level up] --> S[Skill ranks]
  L --> T[Talent gain]
  L --> R[Radiant milestone checks]
  R --> I1[First Ideal]
  I1 --> I2[Later ideals]
```

## Example edge cases
- Attempting to select a talent without required prerequisites (invalid).
- Exceeding skill rank caps at the current level (invalid).
- Unlocking surge features before First Ideal (invalid).

## Source references
- TODO: Stormlight Handbook PDF page citations for each rule above.
