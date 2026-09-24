---
type: agent-team
name: portfolio-migration-team
lead: portfolio-migration-lead
---

# Team: Portfolio Migration

## Goal
Migrate the static card page (`index.html`, Tailwind via CDN, everything in one file) to React components with Tailwind v4 and Storybook: extract reusable components (for example `Avatar`, `SkillTag`, `Card`, `Divider`, plus the existing `Button`), each with a story and MDX docs, compose the page from them, and publish the Storybook. The visual result and the Ukrainian text must stay the same. Scale: one page, roughly five components — a few sessions, not weeks.

## Lead agent
`portfolio-migration-lead` — reads the shared task list and `CLAUDE.md`, splits the page into component and page subtasks, assigns each to a peer, validates results against acceptance criteria, and keeps the task list current between sessions. Note: the lead cannot invoke other agents directly — it recommends the next action, and the calling session runs the named peer.

## Peer agents
- **`component-builder`** — builds each extracted component with its Storybook story and MDX docs
- **`page-composer`** — composes the page from finished components, keeping the original text and the Tailwind comments
- **`code-reviewer`** — read-only review of every change against `CLAUDE.md` and TypeScript correctness
- **`storybook-publisher`** — at the end, builds and publishes the static Storybook, only after the user confirms

## Shared task list location
`.claude/tasks/portfolio-migration.md`

## Workflow
1. Lead reads the goal and `index.html`, lists the components to extract and the page subtask, and writes them to `.claude/tasks/portfolio-migration.md`.
2. The calling session runs `component-builder` for each component subtask; every result goes through `code-reviewer`.
3. Once the components are done, `page-composer` builds the page from them. Replacing `index.html` with the React version is a separate step that needs the user's confirmation.
4. Lead validates (component + story + MDX exist, `npx tsc --noEmit` and `npm run build-storybook` pass, the page matches the original), updates the task list and reports progress.
5. When the user asks to share the result, run `storybook-publisher`.
6. Finished work is merged into `main` via the normal feature-branch + PR flow — this team does not bypass that process.
