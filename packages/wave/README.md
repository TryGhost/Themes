# Wave

A theme dedicated to podcasters and bloggers. Embrace your creativity with ease. Completely free and fully responsive, released under the MIT license.

**Demo: https://wave.ghost.io**

&nbsp;

# Instructions

1. [Download this theme](https://github.com/TryGhost/Wave/archive/master.zip)
2. Log into Ghost, and go to the `Design` settings area to upload the zip file

# Adding Episodes

1. Add a regular post in `Posts > New post` and give it a title and some description in the editor.
2. Enter the episode audio URL in `Post settings > Facebook card > Facebook description` field.

# Creating a Separate Blog Page

1. Upload the routes file (routes.yaml in the theme folder) in `Beta features > Routes`.
2. Add `Blog` tag to your posts and the blog page can be accessed in `example.com/blog`.

# Development

Styles are compiled using Gulp/PostCSS to polyfill future CSS spec. You'll need [Node](https://nodejs.org/), [Yarn](https://yarnpkg.com/) and [Gulp](https://gulpjs.com) installed globally. After that, from the theme's root directory:

```bash
# Install
yarn

# Run build & watch for changes
$ yarn dev
```

Now you can edit `/assets/css/` files, which will be compiled to `/assets/built/` automatically.

The `zip` Gulp task packages the theme files into `dist/<theme-name>.zip`, which you can then upload to your site.

```bash
yarn zip
```

# PostCSS Features Used

- Autoprefixer - Don't worry about writing browser prefixes of any kind, it's all done automatically with support for the latest 2 major versions of every browser.

# Copyright & License

Copyright (c) 2013-2021 Ghost Foundation - Released under the [MIT license](LICENSE).
