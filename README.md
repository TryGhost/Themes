# Ghost Themes

A monorepo for [Ghost](https://github.com/TryGhost/Ghost) official themes. 

## Development

You'll need [Node](https://nodejs.org/), [Yarn](https://yarnpkg.com/) and [Gulp](https://gulpjs.com) installed globally. After that, from the project's root directory:

```bash
# install dependencies
yarn

# run development server
yarn dev
```

Now you can edit files in `packages/<theme-name>/assets/css/` or `packages/<theme-name>/assets/js/`, which will be compiled to `packages/<theme-name>/assets/built/` automatically.

To run a theme locally, you need to symlink a theme to your local Ghost site.

```bash
# run a theme locally
yarn symlink --theme <theme-name> --site /dir/to/your/ghost-site
```

If you're running the Ghost monorepo:
```bash
yarn symlink --theme <theme-name> --site /dir/to/Ghost/ghost/core
```

Or if you're running a Ghost instance via the CLI:
```bash
yarn symlink --theme <theme-name> --site /dir/to/ghost-instance
```

Restart your Ghost instance and the theme will be listed in the `Design` settings.

To create an installable theme zip file in `packages/<theme-name>/dist/`:

```bash
# create .zip file
yarn zip --theme <theme-name>
```

## Publishing & CI

This monorepo contains three types of packages, each with a different shipping mechanism:

### Themes (e.g. `packages/taste/`, `packages/dawn/`, ...)

Each theme has its own CI workflow (`.github/workflows/<theme>.yml`). On push to `main`, the workflow runs tests, deploys the theme to its Ghost demo site via `action-deploy-theme`, and pushes to its standalone subtree repo (e.g. `TryGhost/Taste`). Themes are marked `"private": true` and are not published to npm.

### `@tryghost/shared-theme-assets` (`packages/_shared/`)

Shared CSS, JS, and Handlebars partials used by all themes. Published to npm so themes can pin a version via `devDependencies`.

- **Version bumps happen via `yarn ship:shared`**, which runs `npm version patch` on `_shared`. For minor or major bumps, run `npm --prefix packages/_shared version minor` (or `major`) instead.
- On push to `main`, CI (`.github/workflows/shared-theme-assets.yml`) compares the local version against what's on npm. If the version is newer, it publishes to npm with provenance. If the version hasn't changed, CI skips publishing.
- Renovate will later open PRs to bump the `@tryghost/shared-theme-assets` devDep in each theme.

### `@tryghost/theme-translations` (`packages/theme-translations/`)

Translation files for all themes. Published to npm.

- **Version bumps are automatic.** On every push to `main` that touches `packages/theme-translations/`, CI (`.github/workflows/theme-translations.yml`) runs `npm version patch`, publishes to npm, and commits the version bump back to the repo.
- See `packages/theme-translations/README.md` for how to edit or contribute translations.

### Local commands

```bash
yarn dev            # run development server with live reload
yarn build          # build all themes
yarn ship:shared    # bump _shared version (patch)
yarn test           # run tests locally
yarn zip --theme <name>  # create an installable .zip for a theme
```

## Copyright & License

Copyright (c) 2013-2026 Ghost Foundation - Released under the [MIT license](LICENSE).
