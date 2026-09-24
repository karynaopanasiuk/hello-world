---
type: agent-team
name: design-system-team
lead: design-system-lead
---

# Team: Design System

## Goal
Grow and maintain this project's component library on an ongoing basis: build new Tailwind-styled React components in `src/components/`, and keep Storybook stories and MDX docs current for each of them. This is a long-running initiative with no fixed end date, not a single sprint.

## Lead agent
`design-system-lead` — reads the shared task list and `CLAUDE.md`, breaks incoming goals into subtasks, assigns each to a peer, validates completed work against the task list, and keeps the task list current between sessions. Note: the lead cannot invoke other agents directly — it recommends the next action, and the calling session runs the named peer.

## Peer agents
- **`component-builder`** — builds new Tailwind-styled components with their Storybook stories and MDX docs

## Planned peers (not created yet)
These roles are not defined. If a subtask needs one, the lead flags it to the user instead of inventing it.
- `code-reviewer` — read-only review of changed code against `CLAUDE.md` and TypeScript correctness
- `component-tester` — writes and runs component tests (no test tooling in the repo yet)
- `page-composer` — builds pages out of existing components

## Shared task list location
`.claude/tasks/design-system.md`

## Workflow
1. Lead reads the goal and `.claude/tasks/design-system.md`, breaks it into subtasks assigned to specific peers.
2. The calling session runs each peer agent for its assigned subtask.
3. Lead checks the result against the subtask's acceptance criteria (component, story, MDX, `npx tsc --noEmit` and `npm run build-storybook` passing), then updates the task list and reports progress.
4. Finished work is merged into `main` via the normal feature-branch + PR flow — this team does not bypass that process.
