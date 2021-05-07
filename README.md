# Ghost Themes

## Development

You'll need [Node](https://nodejs.org/), [Yarn](https://yarnpkg.com/) and [Gulp](https://gulpjs.com) installed globally. After that, from the project's root directory:

```bash
# install dependencies
yarn install

# run development server
yarn dev
```

Now you can edit files in `/assets/css/` or `/assets/js/`, which will be compiled to `/assets/built/` automatically.

To run a theme locally, you need to symlink a theme to your local Ghost site:

```bash
# run a theme locally
yarn symlink --theme <theme-name> --site /dir/to/your/ghost-site
```

To create an installable theme zip file in `/packages/<theme-name>/dist/`:

```bash
# create .zip file
yarn zip --theme <theme-name>
```

## Copyright & License

Copyright (c) 2013-2021 Ghost Foundation - Released under the [MIT license](LICENSE).
