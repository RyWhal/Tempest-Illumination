# Tempest-Illumination
A TTRPG character generator.

## Project structure
- `docs/rules/`: Rule references for the wizard and validator.
- `data/stormlight-pack/`: Full Stormlight content pack JSON (restored records with source metadata).
- `src/`: Wizard, sheet, and advancement scaffolding.

## Rule references
- [Character Creation Rules](docs/rules/character-creation.md)
- [Advancement (Levels 2–20)](docs/rules/advancement-levels-2-20.md)
- [Radiant Progression Rules](docs/rules/radiant-progression.md)
- [Combat & Resource Tracking Rules](docs/rules/combat-resources.md)
- [Item Rules](docs/rules/item-rules.md)

## Front-end development
This project uses React + Vite.

```bash
npm install
npm run dev
```

### Common blank page fix
If you open `index.html` directly in the browser or serve the repository root with a generic static server,
you'll see a blank page and a MIME-type error for `src/main.tsx`. Vite must transform the TypeScript/JSX
modules before the browser can load them.

Use one of the following instead:

```bash
npm install
npm run dev
```

Or build and preview the production bundle:

```bash
npm install
npm run build
npm run preview
```
