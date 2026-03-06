# @tryghost/theme-translations

Shared translations for Ghost themes.


## Contributing translations

This is where Ghost theme translations live. If you're here to add or improve translations, here's what you need to know.

Do not submit PRs for translations to individual theme repositories.  Changes made here will propagate to all official
Ghost themes.

### Editing an existing language
1. Find your existing locales file by looking for a file in the locales folder for your language. (e.g. `locales/de.json` for German)
2. Translate the values — leave the keys as-is, they match the English strings used in templates
3. Open a PR

### Adding a new language
1. Identify the appropriate locale code. Because there's one locale setting that impacts translations of the Ghost core, apps, and themes,
you should match [the Ghost core options](https://github.com/TryGhost/Ghost/blob/main/ghost/i18n/lib/locale-data.json) whenever possible. 
2. Copy `locales/en.json` to a new file named with the language code (e.g. `locales/de.json`)
3. Translate the values — leave the keys as-is, they match the English strings used in templates
4. Open a PR

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

### Important notes

- **Keys must not be changed** — they correspond to `{{t "..."}}` calls in Ghost templates and themes
- **Keep `en.json` values as empty strings** — Ghost's `{{t}}` helper uses the key itself as the English fallback, so English values are always blank
- **Placeholders like `{page}` must be kept as-is** — they're replaced at runtime
- **Keys are sorted alphabetically** — please keep this order when adding new keys

### Fixing translation wrapping

If you find a string that is not wrapped with the t helper, PRs to correct that go to the Ghost repo (templates), Source, Casper, or the theme within
Themes/packages.  Do not submit PRs to fix string wrapping individual theme repos other than Source and Casper.

If wrapping strings, favor wrapping full sentences whenever possible, to give translators maximum flexibility to match the appropriate word order in their language.

Poor:  `{{t "By"}} {{authors}}` // does not allow "Jamie Larson tarafından"

Better:  `{{t "By {authors}" authors=(authors) }}`

Poor: `{{t "Previous"}} <span class="desktop-only">{{t "issue"}}</span>` // does not allow "número anterior"

Better: `<span class="desktop-only">{{t "Previous issue"}}</span><span class="mobile-only">{{t "Previous"}}</span>`

---

## Background/Architecture
These shared strings are used by all the themes in this repository, Source, Casper, and (if not overridden by the theme)
by the Ghost core templates `private.hbs`, `content-cta.hbs`, and `pagination.hbs`.  Do not remove strings 
unless you have verified that they are not in use in any of these locations.

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
