# hello-world

Portfolio repo of Karyna Opanasiuk (UX/UI designer): a static Tailwind card page
(`index.html`) plus a React/TypeScript `Button` in `src/components/`. There is no
build toolchain yet (no `package.json`, `tsconfig`, Vite, Storybook), so nothing is
compiled or type-checked — say "untested" instead of claiming it works.

## Conventions
- Tailwind utility classes only; no custom CSS or inline `style`. Write full class
  names (no `` `bg-${color}-600` ``) so the scanner can see them.
- Components: named exports, `forwardRef`, props extend native element attributes,
  variants as a string-literal union + `Record` map (see `Button.tsx`).
- `index.html` keeps Ukrainian comments explaining the Tailwind classes; README and
  `.tsx` comments are English.
- Palette is purple (`purple-600`). `Button` is currently indigo — align it.

## Skills
- `new-component-with-story` (`.claude/skills/`): new component + Storybook story + MDX.

## Git
- Conventional Commits (`feat(button): ...`), branches `feature/<name>`, merge via
  PR. Never commit or push to `main` directly.

## Ask first
- Adding dependencies (`clsx`, `cva`, icon packs, etc.) or setting up the toolchain.
