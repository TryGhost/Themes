# AGENTS.md

## Repo Scope

This is the `TryGhost/Themes` monorepo for official Ghost themes. Work from the repo root unless a package-specific command says otherwise.

## Structure

- `packages/<theme>/`: individual Ghost themes. Theme packages are private and are deployed/pushed to standalone subtree repos by CI.
- `packages/_shared/`: shared CSS, JS, and Handlebars partials. This package is published to npm as `@tryghost/shared-theme-assets`.
- `packages/theme-translations/`: shared locale files and the `mergeLocales` build helper. This package is published to npm as `@tryghost/theme-translations`.
- Root `gulpfile.js` orchestrates all theme builds, tests, zips, symlinks, shared asset copying, and locale merging.

## Setup

- Use Yarn for the monorepo. Do not create or commit `package-lock.json`.
- Install with `yarn`.
- The repo uses Gulp 5, PostCSS, `gscan`, and Yarn workspaces.

## Common Commands

```bash
yarn                         # install dependencies
yarn dev                     # build/watch all themes with livereload
yarn build                   # build all themes
yarn test                    # run gscan for all themes
yarn test:ci --theme <name>  # run fatal/verbose gscan for one theme
yarn zip --theme <name>      # build and write packages/<theme>/dist/<theme>.zip
yarn symlink --theme <name> --site /path/to/Ghost/ghost/core
```

For translation package tests:

```bash
cd packages/theme-translations
npm test
```

## Theme Work

- Edit source CSS in `packages/<theme>/assets/css/`, source JS in `packages/<theme>/assets/js/`, and templates/partials as `.hbs`.
- Rebuild after CSS, JS, shared asset, or locale changes. Built files under `assets/built/` are part of theme output and should be kept in sync when source changes.
- Validate a changed theme with `yarn test:ci --theme <name>`. Prefer targeted validation over running every theme unless the change is cross-cutting.
- For local Ghost verification, symlink the theme into a Ghost checkout with `yarn symlink --theme <name> --site /path/to/Ghost/ghost/core`, restart Ghost, then select the theme in Design settings.

## Shared Assets

- `packages/_shared/assets/js/v1` is used by older themes; `v2` is used by newer themes. Let `gulpfile.js` determine affected themes rather than guessing.
- Shared partials in `packages/_shared/partials/` are copied into newer themes' `partials/components/` during root builds.
- Only run `yarn ship:shared` when intentionally bumping `packages/_shared/package.json` patch version. Minor/major bumps use `npm --prefix packages/_shared version minor|major`.

## Translations

- Shared translation changes belong in `packages/theme-translations/locales/`, not individual theme `locales/` output files.
- Do not rename translation keys. Keep `en.json` values blank, preserve placeholders like `{page}`, and keep keys sorted.
- If a theme needs an override, use a `locales-local/` file and rebuild so merged `locales/` output is regenerated.
- CI bumps and publishes `@tryghost/theme-translations` automatically after changes land on `main`; do not manually version-bump it unless asked.

## Formatting

- Follow `.editorconfig`: UTF-8, LF, 4-space indentation by default, 2-space YAML.
- `.hbs` files are configured without mandatory final newlines.
- Keep changes scoped to the affected theme/package. Avoid touching unrelated generated assets.

## CI Notes

- Theme workflows run `yarn`, then `yarn test:ci --theme <theme>`.
- On `main`, theme workflows deploy to demo Ghost sites and push package subtrees to standalone repos.
- `_shared` CI sanity-checks with `yarn test:ci --theme taste` and publishes only when its package version is newer than npm.

## PR Review Threads

When resolving GitHub PR review threads, use `gh resolve-review-thread`; do not hand-write GraphQL or REST calls for thread resolution.

```bash
gh resolve-review-thread --repo OWNER/NAME --pr NUM --list
gh resolve-review-thread --repo OWNER/NAME --pr NUM --thread PRRT_xxx --comment "meaningful explanation"
```

Every unresolved thread must get a meaningful reply of at least 10 characters and then be resolved.
