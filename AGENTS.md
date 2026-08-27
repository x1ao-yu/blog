# Repository Guidelines

## Project Structure & Module Organization

Firefly is an Astro 7 site with Svelte islands and TypeScript configuration. Main source code lives in `src/`: routes in `src/pages`, layouts in `src/layouts`, reusable UI in `src/components`, styles in `src/styles`, content in `src/content`, helpers in `src/utils`, and Markdown/HTML plugins in `src/plugins`. Site configuration is split across `src/config` with matching type definitions in `src/types`; prefer imports from `@/config` when available. Static files served directly belong in `public`, source-managed images in `src/assets`, docs in `docs` and `Firefly-Docs`, and automation in `scripts`.

## Build, Test, and Development Commands

Use `pnpm`; the `preinstall` script enforces it.

- `pnpm dev` or `pnpm start`: run the local Astro dev server.
- `pnpm check`: run Astro diagnostics.
- `pnpm type-check`: run TypeScript with `--noEmit`.
- `pnpm format`: format `src` with Biome.
- `pnpm lint`: run Biome checks and safe fixes on `src`.
- `pnpm build`: generate icons, LQIPs, the Astro build, font subsets, and Pagefind search output in `dist`.
- `pnpm preview`: preview the production build locally.
- `pnpm new-post`: scaffold a new content post.

## Coding Style & Naming Conventions

Biome is the formatter and linter. It uses tabs for indentation and double quotes for JavaScript/TypeScript strings. Keep Astro and Svelte components in `PascalCase` (`PostCard.astro`, `Search.svelte`), config modules in `camelCase` ending with `Config.ts`, and utilities in descriptive kebab case such as `date-utils.ts`. Keep `src/types` aligned with `src/config`. Avoid unrelated formatting churn.

## Testing Guidelines

There is no dedicated unit-test framework configured. Before submitting changes, run `pnpm check`, `pnpm type-check`, and `pnpm build` for rendering, content, or generated asset work. For visual or interactive changes, verify with `pnpm dev` or `pnpm preview` and include screenshots in the PR. Name future tests near the feature they cover, using the local file name as the stem.

## Commit & Pull Request Guidelines

Use Conventional Commits, matching the current history:

- `feat:` new features or user-visible functionality
- `fix:` bug fixes
- `docs:` documentation or content changes
- `refactor:` code restructuring without behavior changes
- `perf:` performance improvements
- `chore:` dependencies, configuration, build, generated maintenance
- `test:` test-related changes

### Commit Workflow

Treat the working tree, staging area, commit history, and remote repository as separate stages:

1. Inspect the working tree before committing:
   - `git status`
   - `git diff`
   - `git diff --cached` when staged changes exist

2. Group changes by logical purpose, not simply by file or directory.
   - Related changes across multiple files should normally be committed together.
   - Unrelated changes must be split into separate commits.
   - Do not create one commit per file unless each file represents an independent logical change.

3. Prefer selective staging:
   - Use `git add <file-or-directory>` for focused changes.
   - Do not use `git add .` by default.
   - Use `git add -p` when a single file contains multiple unrelated logical changes.

4. Each commit should represent one clear, self-contained logical change.
   - Commit messages must describe the actual change.
   - Avoid vague messages such as `update`, `modify`, `changes`, `fix stuff`, or `today's changes`.
   - Do not write a commit message merely to make the GitHub file list look cleaner.

5. Keep unrelated working-tree changes untouched.
   - If unrelated modifications already exist, do not include them in the current commit unless explicitly requested.
   - Do not revert, overwrite, or delete unrelated user changes.

6. Multiple focused commits may be pushed together with a single `git push`.
   - `git push` synchronizes the local commit history with the remote repository; it does not require one push per commit.

### Example

If a task updates icons, adds a post, and fixes a build script, prefer:

```bash
git add public/
git commit -m "feat: update icons with separate light and dark variants"

git add src/
git commit -m "docs: add Markdown format test post"

git add scripts/
git commit -m "fix: correct build script"
```
Do not run `git push` unless the user explicitly asks for the changes to be pushed.

## Security & Configuration Tips

Do not commit secrets, tokens, or service keys in config files. Keep deployment-specific settings in the target platform environment, and review generated files such as `dist`, `src/constants/lqips.json`, and `src/constants/icons.ts` before committing them.
