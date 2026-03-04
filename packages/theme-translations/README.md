# @tryghost/theme-translations

Shared translations for Ghost themes.

## Contributing translations

This is where Ghost theme translations live. If you're here to add or improve translations, here's what you need to know.

### Adding a new language

1. Copy `locales/en.json` to a new file named with the language code (e.g. `locales/de.json`)
2. Translate the values — leave the keys as-is, they match the English strings used in templates
3. Open a PR

For example, to add German:

```json
{
    "Featured": "Empfohlen",
    "Newer Posts": "Neuere Beiträge",
    "Older Posts": "Ältere Beiträge",
    "Page {page} of {totalPages}": "Seite {page} von {totalPages}",
    "Read more": "Weiterlesen",
    "Subscribe": "Abonnieren"
}
```

You don't need to translate every key at once. Missing or blank values fall back to the English key automatically.

### Updating an existing translation

Find the locale file in `locales/` (e.g. `locales/fr.json`), update the values you want to change, and open a PR.

### Important notes

- **Keys must not be changed** — they correspond to `{{t "..."}}` calls in Ghost templates and themes
- **Keep `en.json` values as empty strings** — Ghost's `{{t}}` helper uses the key itself as the English fallback, so English values are always blank
- **Placeholders like `{page}` must be kept as-is** — they're replaced at runtime
- **Keys are sorted alphabetically** — please keep this order when adding new keys

---

## Theme developer guide

This package contains locale JSON files and a `mergeLocales` build utility that themes use to merge shared translations with their own overrides.

### Contents

- `locales/` — Shared locale JSON files (e.g. `en.json`)
- `build/` — Exports the `mergeLocales` Gulp task helper
- `renovate-config.json` — Shareable Renovate preset for auto-merging updates

### Setup

Install the package as a dev dependency:

```bash
npm install --save-dev @tryghost/theme-translations
```

Add the locale merge task to your Gulpfile:

```js
const { mergeLocales } = require('@tryghost/theme-translations/build');

gulp.task('locales', mergeLocales());
gulp.task('build', gulp.series('css', 'js', 'locales'));

// Optional: watch for local override changes during development
gulp.watch('./locales-local/**/*.json', gulp.series('locales'));
```

That's it. Running `gulp locales` (or `gulp build`) will write the merged translations to `./locales/`.

## How mergeLocales works

When called with no arguments, `mergeLocales()` follows these conventions:

| Setting | Default |
|---------|---------|
| Shared locales | Resolved automatically from the installed package |
| Local overrides | `./locales-local/` (ignored if it doesn't exist) |
| Output | `./locales/` |

The merge process:

1. Reads all `.json` files from the shared locales directory
2. Reads matching `.json` files from the local overrides directory (if it exists)
3. Merges them — local non-blank values win over shared values
4. Sorts keys alphabetically for stable diffs
5. Writes the merged result to the output directory

### Custom paths

If your theme uses a different directory layout, pass options:

```js
gulp.task('locales', mergeLocales({
    local: './my-custom-overrides',
    output: './locales'
}));
```

## Theme-specific overrides

To override specific translations for your theme, create a `locales-local/` directory with JSON files matching the locale name:

```
my-theme/
├── locales-local/
│   └── en.json      ← your overrides
├── locales/
│   └── en.json      ← merged output (generated, do not edit)
└── gulpfile.js
```

In your override file, only include the keys you want to change:

```json
{
    "Subscribe": "Join us"
}
```

Blank values (`""`) in override files are ignored, so you won't accidentally clear a shared translation.

## Renovate auto-merge

To automatically merge translation updates, extend the shipped Renovate preset in your theme's `renovate.json`:

```json
{
    "extends": ["github>TryGhost/Themes:packages/theme-translations/renovate-config"]
}
```

This auto-merges `@tryghost/theme-translations` version bumps on weekdays via PR (so CI still runs).

## Package development

### Running tests

```bash
cd packages/theme-translations
npm test
```

Tests use Node's built-in test runner (`node:test`) with no external dependencies.

### Publishing

The package is published automatically. When changes to `packages/theme-translations/` are merged to `main`, CI bumps the patch version, commits the bump, and publishes to npm with OIDC provenance. No manual steps needed.

This package is excluded from the monorepo's Lerna publishing (`yarn ship`) — it ships independently so translation updates can be published without bumping `@tryghost/shared-theme-assets`.
