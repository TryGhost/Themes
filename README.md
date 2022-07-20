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

Now you can edit files in `themes/<theme-name>/assets/css/` or `themes/<theme-name>/assets/js/`, which will be compiled to `themes/<theme-name>/assets/built/` automatically.

To run a theme locally, you need to symlink a theme to your local Ghost site.

```bash
# run a theme locally
yarn symlink --theme <theme-name> --site /dir/to/your/ghost-site
```

Restart your Ghost instance and the theme will be listed in the `Design` settings.

To create an installable theme zip file in `themes/<theme-name>/dist/`:

```bash
# create .zip file
yarn zip --theme <theme-name>
```

## Copyright & License

Copyright (c) 2013-2022 Ghost Foundation - Released under the [MIT license](LICENSE).
