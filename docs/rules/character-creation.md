# Character Creation Rules

## Rule summary table
| Area | Summary | Notes |
| --- | --- | --- |
| Ancestry | Choose Human or Singer. | Applies ancestry effects and talent picks. |
| Culture | Pick exactly two cultural expertises. | Expertise definitions may include language/sub-choices. |
| Starting path | Pick one heroic path. | Grants a key talent and starting skill rank. |
| Attributes | Allocate creation points across six attributes. | Enforce totals and per-attribute caps. |
| Skills | Apply path free rank and allocate remaining ranks. | No skill above rank 2 at level 1. |
| Talents | Add ancestry/path key talents and required choices. | Block illegal prerequisites. |
| Equipment | Choose a starting kit. | Populate inventory with items. |
| Story metadata | Name, purpose, obstacle, goals. | Goals tie to Radiant triggers. |

## Dependencies / prerequisites graph
```mermaid
graph TD
  A[Ancestry] --> T1[Ancestry talents]
  A --> C[Culture expertises]
  P[Starting path] --> T2[Path key talent]
  P --> S1[Starting skill rank]
  S1 --> S2[Skill allocation]
  A --> T3[Extra talent choice (Human)]
  A --> T4[Singer form change]
  C --> S3[Expertise bonuses]
  T1 --> T5[Talent prerequisites]
  T2 --> T5
  S2 --> T5
```

## Example edge cases
- Singer ancestry selected without Change Form talent choice (invalid).
- Human ancestry selected but extra talent pick not taken (invalid).
- More or fewer than two cultural expertises chosen (invalid).
- Skill rank allocation exceeds level-1 cap for a single skill (invalid).

## Source references
- TODO: Stormlight Handbook PDF page citations for each rule above.
