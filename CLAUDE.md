# hello-world

Portfolio repo of Karyna Opanasiuk (UX/UI designer): a static Tailwind card page
(`index.html`) plus a small React/TypeScript component library documented in Storybook,
with design tokens synced from a Figma design system ("Published! Design System").

## Tech stack
- **Page:** plain HTML, `lang="uk"`, Tailwind via CDN. Not built by Vite.
- **Components:** React 19, TypeScript 7 (`strict`, `verbatimModuleSyntax`), Vite 8.
- **Styling:** Tailwind CSS 4, CSS-first (`src/index.css`); there is no `tailwind.config.js`.
- **Docs:** Storybook 10 (`@storybook/react-vite`, `@storybook/addon-docs`), stories and MDX
  next to each component.
- **Tokens:** Style Dictionary 5. `tokens.json` (W3C DTCG) is generated from Figma.

## Commands
- `npm run typecheck` — `tsc --noEmit`
- `npm run storybook` / `npm run build-storybook`
- `npm run tokens` — rebuild CSS from `tokens.json`
- `npm run tokens:pull` — read Figma into `tokens.json`; `npm run tokens:sync` — pull + build

`typecheck` and `build-storybook` pass on `main`. Say "untested" for anything you did not run.

## File structure
```
index.html                      static card page (Ukrainian comments)
src/components/                 Button, Field, Notification: .tsx + .stories.tsx + .mdx
src/assets/notification/        SVG icons exported from Figma
src/styles/                     GENERATED: tokens.css, tokens.modes.css, tokens.theme.css
src/index.css                   Tailwind entry
tokens.json                     GENERATED from Figma; style-dictionary.config.mjs builds it
scripts/figma-to-tokens.mjs     Figma -> tokens.json (through the figmosha bridge)
.storybook/                     Storybook config
.claude/{skills,agents,teams,tasks}/   Claude Code skills, subagents, team docs, task lists
.mcp.json                       Figma MCP server
```

## Conventions
- **Components:** named exports, `forwardRef`, props extend native element attributes,
  variants as a string-literal union + `Record` map, caller `className` last (see `Button.tsx`).
  Compound components live in one file (see `Field.tsx`). Every component has a story and an
  MDX page; MDX imports come from `@storybook/addon-docs/blocks`.
- **Tailwind:** utility classes only, no custom CSS or inline `style`. Write full class names
  (no `` `bg-${color}-600` ``) so the scanner sees them. Arbitrary values are fine.
- **Palette:** `Button` and the card page use purple (`purple-600`). `Notification` follows
  the Figma design system (blue `#1b68fa`), so the two differ.
- **Comments:** `index.html` keeps Ukrainian comments explaining the Tailwind classes;
  README and `.tsx` comments are English.
- **Tokens are generated.** Never edit `tokens.json` or `src/styles/*` by hand: change the
  variable in Figma and run `/tokens-sync`. Figma `color/text/theme` becomes
  `--color-text-theme`; radius tokens are `--radius-ds-*` so they do not override Tailwind's
  `rounded-*`. Semantic colors have Figma modes (default `Primary`) emitted as
  `[data-theme="<mode>"]` in `tokens.modes.css`.

## Skills and agents
- Skills: `new-component-with-story` (component + story + MDX), `tokens-sync` (Figma tokens
  to git; manual only, never commits to `main`).
- Subagents in `.claude/agents/`: `component-builder`, `page-composer`, `code-reviewer`
  (read-only), `storybook-publisher`, plus two leads (`design-system-lead`,
  `portfolio-migration-lead`) that plan and track work in `.claude/tasks/` but cannot invoke
  other agents. Team descriptions are in `.claude/teams/`.

## Figma access
- The Figma MCP (`.mcp.json`) works per node and hits plan limits; it cannot export a whole file.
- The figmosha bridge (`localhost:8787`, plugin "Figmosha Bridge" running in Figma Desktop
  in the design-system file) reads everything; `scripts/figma-to-tokens.mjs` uses it.

## Git
- Conventional Commits (`feat(button): ...`), branches `feature/<name>`, merge via PR.
  Never commit or push to `main` directly.

## Ask first
- Adding dependencies (`clsx`, `cva`, icon packs, fonts, etc.).
- Publishing Storybook (public), or replacing `index.html` with a React version.
- Importing `src/styles/tokens*.css` into `src/index.css` (not wired in yet).

## Known gaps
- Inter Variable (the Figma font) is not loaded, so Storybook falls back to a system font.
- `Notification` implements the Type x Size set only; the Figma set with `Style` (Light/White)
  and the `Grey` type is not built.
- `index.html` is still the static page; the portfolio migration to React has not started.
