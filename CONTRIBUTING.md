# Contributing to Shelf UI

Thanks for your interest in contributing. This guide covers everything you need to get started.

## Development Setup

```bash
git clone https://github.com/yourusername/shelf-ui.git
cd shelf-ui
pnpm install
pnpm dev
```

## Project Structure

- `components/shelf-ui/` — source components
- `content/docs/` — MDX documentation pages
- `hooks/` — headless hooks
- `lib/adapters/` — storage provider adapters
- `scripts/` — registry build and validation scripts
- `public/r/` — built registry JSON

## Adding a New Component

- [ ] Create `components/shelf-ui/component-name.tsx`
- [ ] Create `components/shelf-ui/examples/component-name-demo.tsx`
- [ ] Add entry to `registry.json`
- [ ] Run `pnpm registry:build` and `pnpm registry:check`
- [ ] Create `content/docs/components/component-name.mdx`
- [ ] Run `pnpm check` and `pnpm typecheck`
- [ ] Add a changeset: `pnpm changeset`

## Commit Format

Shelf UI uses [Conventional Commits](https://www.conventionalcommits.org):
feat(dropzone): add multi-file support
fix(file-card): resolve preview flicker on slow connections
docs(supabase): add RLS configuration guide
chore(registry): add file-icon to registry manifest

Scope is always kebab-case. Subject under 72 characters. Present tense.

## Pull Requests

- One thing per PR
- Fill out the PR template completely
- All checklist items must pass before review

## Reporting Bugs

Use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md).

## Suggesting Features

Use the [feature request template](.github/ISSUE_TEMPLATE/feature_request.md).
