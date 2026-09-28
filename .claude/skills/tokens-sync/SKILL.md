---
name: tokens-sync
description: Sync design tokens from Figma to git. Exports all Figma Variables (colors, spacing, radius, text and effect styles) to tokens.json in W3C DTCG format, rebuilds the CSS with Style Dictionary, shows the token diff, then commits and pushes. Use when the user runs /tokens-sync or asks to update, pull or sync design tokens or Figma variables.
argument-hint: "[figma-file-url] [--dry-run]"
disable-model-invocation: true
---

# Skill: Sync design tokens from Figma to git

When the user runs `/tokens-sync [figma-file-url] [--dry-run]` (or asks to update the design tokens from Figma).

`--dry-run` stops after the DIFF step: nothing is committed or pushed.

## Steps

### 0. Preflight
1. Read `CLAUDE.md` for the project rules (branches, commits, dependencies).
2. `git branch --show-current`. Never commit to `main`: if on `main`, create `chore/tokens-sync-<YYYY-MM-DD>` first and tell the user.
3. `git status --short`: note unrelated uncommitted changes; they must not end up in the commit.
4. Check `node_modules/` exists (else `npm install`) and that `style-dictionary.config.mjs` exists. If the config is missing, create it: `source: ["tokens.json"]`, `usesDtcg: true`, platform `css` (`transformGroup: "css"`, `buildPath: "src/styles/"`, `tokens.css` with `css/variables` and `outputReferences: true`), and add `"tokens": "style-dictionary build --config style-dictionary.config.mjs"` to `package.json`. Tell the user what was created.

### 1. EXPORT (Figma -> tokens.json)
The Figma MCP can only read variables per node (`get_variable_defs` returns one value per name, ignores modes, misses unused variables) and hits plan limits, so it cannot export a whole file. Use the figmosha bridge (Figma plugin API), which reads everything:
1. `curl -s localhost:8787/status`. If the bridge is down, start the `figmosha-bridge` server (launch config in `Design Engineer/.claude/launch.json`). If `plugin_connected` is false, ask the user to open the design-system file in Figma Desktop and run Plugins > Development > Figmosha Bridge.
2. Confirm the open file is the right one (the script prints the file name; if a `[figma-file-url]` was given, tell the user which file name you expect and let them confirm).
3. `npm run tokens:pull` (runs `scripts/figma-to-tokens.mjs`). It writes `tokens.json` (W3C DTCG: `$value` + `$type`, aliases as `{path}`, Figma modes in `$extensions`).
4. If the bridge is impossible, fall back to the Figma MCP (`get_variable_defs` on the relevant nodes), but treat the result as partial: do not overwrite `tokens.json` with it; only report what differs and ask the user how to proceed.

### 2. BUILD
`npm run tokens` (Style Dictionary). It regenerates `src/styles/tokens.css`, `tokens.modes.css` and `tokens.theme.css`. On error stop and show it; do not hand-edit the generated CSS.

### 3. DIFF (before any commit)
1. `node .claude/skills/tokens-sync/scripts/diff-tokens.mjs` (token-level: added / changed / removed / rename candidates) and `git diff --stat -- tokens.json src/styles`.
2. No changes: report "already in sync" and stop.
3. Removed tokens or rename candidates: **stop and ask for confirmation** before going on, listing them. If the user declines, restore with `git checkout -- tokens.json src/styles`.
4. A confirmed rename: `tokens.json` and the CSS already change together because both come from the same build. Also search the code for the old names (`grep -rn "--<old-css-var>\|<utility>-<old-name>" src .storybook`), show the usages and update them only after confirmation.
5. With `--dry-run`, stop here and print the report.

### 4. COMMIT
1. `git add tokens.json src/styles` (plus files whose renamed usages the user approved). Nothing else.
2. `git commit -m "chore(tokens): sync from Figma"`
3. `git push` (or `git push -u origin <branch>` when there is no upstream). Never push `main`.

### 5. REPORT
Short summary:
- token count (before -> after), added / changed / removed / renamed
- branch and the commit link: build it from `git remote get-url origin` (`https://github.com/<owner>/<repo>/commit/<sha>`)
- any caveat (skipped renames, partial MCP export, warnings from Style Dictionary)
- offer to open a PR if the branch is not `main`-tracking and none exists

## Output format
The diff summary from step 3, the checklist of steps done (export ✓ / build ✓ / diff ✓ / commit ✓ / push ✓), then the report from step 5.

## Conventions to follow
- Conventional Commits, feature/chore branches, PRs into `main` (see `CLAUDE.md`)
- Tokens are generated: change them in Figma and re-run the skill, never edit `tokens.json` or the CSS by hand
- Variable names map to CSS names: `color/text/theme` -> `--color-text-theme`, aliases stay as `var(--…)`

## Don't
- Don't delete or rename tokens without the user's confirmation
- Don't commit to or push `main`
- Don't stage anything except `tokens.json` and `src/styles` (and approved rename fixes)
- Don't invent token values that Figma did not return
- Don't add dependencies
