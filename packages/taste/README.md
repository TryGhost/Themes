# Taste

Taste is a recipe-focused [Ghost](https://github.com/TryGhost/Ghost) theme for food publishers who want magazine-style sections, email signup prompts, and configurable homepage topics.

**Demo: https://taste.ghost.io**

# Instructions

1. [Download this theme](https://github.com/TryGhost/Taste/archive/main.zip)
2. Log into Ghost, and go to the `Design` settings area to upload the zip file

# Development

Styles are compiled using Gulp/PostCSS to polyfill future CSS spec. You'll need [Node](https://nodejs.org/), [pnpm](https://pnpm.io/) and [Gulp](https://gulpjs.com) installed globally. After that, from the theme's root directory:

```bash
# Install
pnpm install

# Run build & watch for changes
pnpm dev
```

Now you can edit `/assets/css/` or `/assets/js/` files, which will be compiled to `/assets/built/` automatically.

The `zip` Gulp task packages the theme files into `dist/taste.zip`, which you can then upload to your site.

```bash
pnpm zip
```

# Contribution

This repo is synced automatically with the [TryGhost/Themes](https://github.com/TryGhost/Themes) monorepo. If you're looking to contribute or raise an issue, head over to the main repository where our official themes are developed.

## Theme translations

Please see the @Tryghost/Themes/theme-translations/README.md for how to edit or contribute translations.

# Copyright & License

Copyright (c) 2013-2026 Ghost Foundation - Released under the [MIT license](LICENSE).
