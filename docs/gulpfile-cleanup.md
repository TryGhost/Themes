# Gulpfile cleanup tasks

Tracked issues to address in a follow-up PR after #476 merges.

## Missing `return` after error guards

Several functions check for required `argv` parameters but don't `return` after the error path, so execution falls through to the main logic with `undefined` values.

Affected functions:
- `testCI` (line ~246)
- `zipper` (line ~275)
- `symlink` (line ~216)

The fix in each case is adding `return;` after the `handleError(done(...))` call, matching what we did for `translations` in #476.

## `done` called multiple times in loop-based functions

Several functions inside `main()` iterate over packages and call `done` for each one instead of signaling completion once. Gulp expects `done` exactly once.

Affected functions:
- `sharedCSS_v1` (line ~116)
- `sharedCSS_v2` (line ~132)
- `sharedJS_v1` (line ~148)
- `sharedJS_v2` (line ~161)
- `copyPartials` (line ~188)

The pattern to fix is the same one we applied to `sharedTranslations` in #476: create an array of tasks and use `parallel()` instead of calling the callback inside a `forEach`.

## Duplicated logic between `main()` and `buildAll`

`buildAll` duplicates the theme glob, per-theme task creation, and `copyPartials` logic that already exists in `main()`. These could be extracted into shared helpers to reduce drift between the two code paths.

## Future ideas (not actionable yet)

### Automating translation shipping

Currently, translation changes in `packages/theme-translations/` are immediately available in the monorepo via the relative path import, but themes only get rebuilt and published when someone manually runs `yarn ship`. This is intentional — automated rebuilds would bundle translation changes into theme version bumps alongside unrelated changes, making changelogs unclear.

If we ever want to automate this, some options explored:
- **Single "rebuild-all-themes" workflow** triggered on translation locale changes — runs `gulp buildAll`, commits regenerated `locales/` files, lets per-theme workflows handle the rest
- **Scheduled workflow** — cron-based `gulp buildAll` to batch translation updates (e.g., weekly)
- **Per-theme path triggers** — add `packages/theme-translations/locales/**` to each theme's workflow

All of these have the same changelog problem: they'd mix translation updates into theme releases without clear separation. Worth revisiting if we find a way to handle versioning/changelogs that distinguishes translation-only bumps from feature/fix releases.
