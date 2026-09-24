---
name: new-component-with-story
description: Use when the user asks to create a new React component together with its Storybook story and MDX documentation.
---

# Skill: New Component with Storybook Story

When user asks to create a new component (e.g. "create a Card component with a story",
"add a new component + story + docs", "додай компонент Badge зі сторі").

## Steps
1. Read `CLAUDE.md` at the repo root if it exists; otherwise use `src/components/Button.tsx`
   as the reference for conventions.
2. Check whether the toolchain exists: `package.json`, React + TypeScript, Tailwind, and
   Storybook (`storybook` + `@storybook/react-vite` and a `.storybook/` folder). If something
   is missing, stop and tell the user what is missing and propose the setup (Vite + React +
   TS strict, Tailwind, Storybook with `.storybook/main.ts` and `preview.ts` importing the
   Tailwind CSS). Install only after the user agrees.
3. Create `src/components/<Name>.tsx`:
   - Named export function component (`export const Name`), no default export
   - `forwardRef` when it renders a single native element
   - Props interface extends the relevant native element attributes
   - Variants as a string-literal union + `Record<Variant, string>` class map, with a
     `base` constant for shared classes and the caller's `className` appended last
   - Tailwind classes written out in full (never built dynamically), no custom CSS
   - `import type` for type-only imports
4. Create `src/components/<Name>.stories.tsx`:
   - CSF3: `Meta<typeof Name>` + one named `StoryObj` export per variant/state
   - `title` is `Components/<Name>`, add `tags: ["autodocs"]` only if no MDX page exists
5. Create `src/components/<Name>.mdx`:
   - Import blocks from the path that matches the installed Storybook version
     (v8: `@storybook/blocks`; v9+: `@storybook/addon-docs/blocks`)
   - `Meta` bound to the stories file, `Canvas` per story, `Controls` for the props table
   - 2–3 sentences on purpose and variants
6. Verify: `npx tsc --noEmit` and `npm run build-storybook`. Report the result; if
   either can't run, say so instead of claiming it works.

## Output format
List files created/changed with a one-line description each, show the full content of each
new file, then a checklist: types ✓ / story build ✓ / MDX renders ✓ (or "not run" and why).

## Conventions to follow
- Same shape as `Button.tsx`: `forwardRef`, `variants` map, `type` defaults sensible
  (e.g. `type="button"`), `className` passthrough
- Two-space indent, double quotes, semicolons, trailing commas
- Conventional Commits for the commit, `feature/<name>` branch, PR into `main`
- Colors from the project palette (purple, as on the card page) — check `Button.tsx`
  before picking new ones

## Don't
- Don't use `any` in component or story props
- Don't add `tailwind.config.js` if Tailwind v4 is installed (config lives in CSS)
- Don't write custom CSS for story previews — reuse the component's Tailwind classes
- Don't skip the MDX page, even for a trivial component
- Don't add dependencies (`clsx`, `cva`, icon packs) without asking
- Don't say the story works if `build-storybook` wasn't run
