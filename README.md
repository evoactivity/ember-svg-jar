<p align="center">
  <a href="https://svgjar.web.app" target="_blank">
    <img src="https://svgjar.web.app/images/logo-96eaca43925f5d648acc8193b1b9ddd7.svg" alt="Logo">
  </a>
</p>

<h3 align="center">
  Best way to use SVG images in Ember apps.
</h3>

<p align="center">
  <a href="https://svgjar-demo.web.app" target="_blank">🎮 View Live Demo</a>
  ·
  <a href="https://github.com/ivanvotti/ember-svg-jar/issues/new?template=---bug-report.md">🐞 Report Bug</a>
  ·
  <a href="https://github.com/ivanvotti/ember-svg-jar/issues/new?template=---feature-request.md">🍩 Request Feature</a>
  ·
  <a href="https://github.com/ivanvotti/ember-svg-jar/issues/new?template=---question.md">🤔  Ask Question</a>
</p>

<p align="center">
  <a href="https://github.com/ivanvotti/ember-svg-jar/actions?query=workflow%3ATest" target="_blank">
    <img src="https://github.com/ivanvotti/ember-svg-jar/workflows/Test/badge.svg?branch=master"
      alt="Build Status">
  </a>
  <a href="https://www.npmjs.com/package/ember-svg-jar" target="_blank">
    <img src="https://img.shields.io/npm/v/ember-svg-jar.svg?color=informational" />
  </a>
  <a href="https://www.npmjs.com/package/ember-svg-jar" target="_blank">
    <img src="https://img.shields.io/npm/dm/ember-svg-jar.svg?color=informational" />
  </a>
  <a href="http://emberobserver.com/addons/ember-svg-jar" target="_blank">
    <img src="http://emberobserver.com/badges/ember-svg-jar.svg" alt="Ember Observer Score">
  </a>
</p>

![](https://svgjar.web.app/images/app-screenshot-adb77f291ccaf5251e42c31eb3b5ddd3.png)

## Table of Contents

- [🍩 Features](#-features)
- [👋 Getting started](#-getting-started)
- [🎮 Usage](#-usage)
- [🔧 Configuration](#-configuration)
- [❓ FAQ](#-faq)
- [👓 Compatibility](#-compatibility)
- [💟 Contributors](#-contributors)
- [🆓 License](#-license)

## 🍩 Features

Here's some of useful features:

- <a href="https://svgjar-demo.web.app" target="_blank">Visual workflow</a> to find and use SVGs the fastest way possible
- Automatic SVG optimization (it can cut file size by half or more)
- Easy to use helper `{{svg-jar "asset-name"}}`
- Support for both `inline` and `symbol` embedding methods
- Copy SVG as CSS background
- Zero configuration

## 👋 Getting started

**Installation**

`$ ember install ember-svg-jar`

**Start in 3 easy steps**

- 1️⃣ Drop some SVG images to the `public` directory (e.g. [material-design-icons](https://github.com/google/material-design-icons))

- 2️⃣ Open the [asset viewer](http://localhost:4200/ember-svg-jar/index.html) and select any icon you like

- 3️⃣ Copy the helper code from the viewer and paste it to your template

## 🎮 Usage

Place your SVG images to the `public` directory (e.g. `./public/images/my-icon.svg`). Then copy the helper code for your image from the [asset viewer](http://localhost:4200/ember-svg-jar/index.html) or just write it by hand like this: `{{svg-jar "my-icon"}}`.

The viewer is available at: <a href="http://localhost:4200/ember-svg-jar/index.html" target="_blank">http://localhost:4200/ember-svg-jar/index.html</a>

If your `rootURL` is not `/`, then to use the asset viewer you will need to add `rootURL` to the addon [config](https://github.com/ivanvotti/ember-svg-jar/blob/master/docs/configuration.md#global-options).

### Helper

Use the `svg-jar` helper to embed SVG images to your application's templates.

For the default `inline` embedding strategy you can write:

```handlebars
{{svg-jar 'my-cool-icon' class='icon' width='24px'}}
```

The helper takes an asset ID and optional attributes that will be added to the created SVG element. The example above will create an SVG like this:

```handlebars
<svg class='icon' width='24px'>...</svg>
```

For the `symbol` strategy you will need to add `#` to the asset ID like this:

```handlebars
{{svg-jar '#my-cool-icon'}}
```

In this case the result can look like this:

```handlebars
<svg><use xlink:href='#my-cool-icon'></use></svg>
```

### Accessibility

Pass `title`, `desc`, and `role` as properties to the helper in order to include accessible elements or attributes. `aria-labelledby` will be automatically added and point to `title` and/or `desc` if they are included.

Writing this:

```handlebars
{{svg-jar 'my-cool-icon' role='img' title='Icon' desc='A very cool icon'}}
```

Will create an SVG that looks like this:

```handlebars
<svg role="img" aria-labelledby="title desc">
  <title id="title">Icon</title>
  <desc id="desc">A very cool icon<desc>
</svg>
```

### Assets from Node modules

By default `ember-svg-jar` looks for SVGs in the `public` directory. To get SVGs from `node_modules` packages or any other directory you will need to add them to `ember-cli-build.js` like this:

```js
var app = new EmberApp(defaults, {
  svgJar: {
    sourceDirs: [
      'node_modules/material-design-icons/file/svg/design',
      'node_modules/material-design-icons/action/svg/design',
      'public/images/icons',
    ],
  },
});
```

[Click here for more configuration options](#configuration)

### Usage in an addon

Using `ember-svg-jar` in an addon is the same as in an app, except that in the `package.json`
of the addon, it should be listed as one of the `dependencies` and not `devDependencies`.

## 🔧 Configuration

The addon should be useful without any configuration. But it wants to be very configurable when it's time to adjust it for your needs.

- [All configuration options](docs/configuration.md)
- [Advanced usage examples](docs/examples.md)

## ❓ FAQ

**Q:** `Will the asset viewer affect my production build size?`  
**A:** No, it won't at all. The asset viewer is included in development mode only.

**Q:** `Can it find SVG icons outside of the public directory, e.g. from node_modules?`  
**A:** Yes, it can import SVGs from any directory defined in the sourceDirs array.

**Q:** `Why the SVG files deployed into the dist/assets folder without being fingerprinted?`  
**A:** This is done with the default ember cli behaviour. For more information see [SVG Fingerprinting](docs/svg-fingerprinting.md).

**Q:** `Why does this matter?`

- [Why GitHub switched from an icon font to SVG](https://github.com/blog/2112-delivering-octicons-with-svg)
- ["Inline SVG vs icon fonts" from css-tricks](https://css-tricks.com/icon-fonts-vs-svg/)
- [Ten reasons to switch from an icon font to SVG](http://ianfeather.co.uk/ten-reasons-we-switched-from-an-icon-font-to-svg/)

**Q:** `Why would you switch from Font Awesome to SVG?`

- original Font Awesome is about `149 KB` as TTF and `88.3 KB` as WOFF
- it includes `634` icons and you need just some of them usually
- 20 Font Awesome icons in SVGJar will be about 4.3 KB (you save `84 KB` or `145 KB` as TTF)
- 50 Font Awesome icons in SVGJar will be about `9 KB`

You can get Font Awesome icons as individual SVG files from [font-awesome-svg](https://github.com/ivanvotti/font-awesome-svg).

## 👓 Compatibility

Latest ember-svg-jar currently supports:

- Ember.js v3.20 or above
- Ember CLI v3.20 or above
- Node.js v12 or above

## 💟 Contributors

Contributions of any kind welcome! See the [Contributing](CONTRIBUTING.md) guide for details.

Thanks goes to these wonderful people:

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://ivanvotti.com/"><img src="https://avatars.githubusercontent.com/u/1476221?v=4" width="100px;" alt=""/><br /><sub><b>Ivan Votti</b></sub></a></td>
    <td align="center"><a href="https://github.com/jherdman"><img src="https://avatars.githubusercontent.com/u/3300?v=4" width="100px;" alt=""/><br /><sub><b>James Herdman</b></sub></a></td>
    <td align="center"><a href="http://eaf4.com"><img src="https://avatars0.githubusercontent.com/u/319282?v=4" width="100px;" alt=""/><br /><sub><b>Edward Faulkner</b></sub></a></td>
    <td align="center"><a href="https://github.com/Turbo87"><img src="https://avatars2.githubusercontent.com/u/141300?v=4" width="100px;" alt=""/><br /><sub><b>Tobias Bieniek</b></sub></a></td>
    <td align="center"><a href="https://shipshape.io"><img src="https://avatars3.githubusercontent.com/u/2640861?v=4" width="100px;" alt=""/><br /><sub><b>Robert Wagner</b></sub></a></td>
    <td align="center"><a href="https://github.com/wagenet"><img src="https://avatars3.githubusercontent.com/u/9835?v=4" width="100px;" alt=""/><br /><sub><b>Peter Wagenet</b></sub></a></td>
    <td align="center"><a href="https://github.com/ryanpatrickcook"><img src="https://avatars2.githubusercontent.com/u/3067243?v=4" width="100px;" alt=""/><br /><sub><b>Ryan Cook</b></sub></a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/mupkoo"><img src="https://avatars0.githubusercontent.com/u/1788571?v=4" width="100px;" alt=""/><br /><sub><b>Mirko Akov</b></sub></a></td>
    <td align="center"><a href="http://mrloop.com"><img src="https://avatars3.githubusercontent.com/u/12345?v=4" width="100px;" alt=""/><br /><sub><b>Ewan McDougall</b></sub></a></td>
    <td align="center"><a href="https://github.com/markcatley"><img src="https://avatars0.githubusercontent.com/u/5198?v=4" width="100px;" alt=""/><br /><sub><b>Mark Catley</b></sub></a></td>
    <td align="center"><a href="http://www.seated.com"><img src="https://avatars1.githubusercontent.com/u/19490?v=4" width="100px;" alt=""/><br /><sub><b>John Griffin</b></sub></a></td>
    <td align="center"><a href="http://www.facebook.com/lucin.ivan"><img src="https://avatars3.githubusercontent.com/u/4481706?v=4" width="100px;" alt=""/><br /><sub><b>Ivan Lučin</b></sub></a></td>
    <td align="center"><a href="https://hyjk2000.github.io"><img src="https://avatars1.githubusercontent.com/u/4647136?v=4" width="100px;" alt=""/><br /><sub><b>James Shih</b></sub></a></td>
    <td align="center"><a href="http://seg.al"><img src="https://avatars1.githubusercontent.com/u/3156114?v=4" width="100px;" alt=""/><br /><sub><b>djsegal</b></sub></a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://jan.buschtoens.me"><img src="https://avatars0.githubusercontent.com/u/834636?v=4" width="100px;" alt=""/><br /><sub><b>Jan Buschtöns</b></sub></a></td>
    <td align="center"><a href="https://siva.dev"><img src="https://avatars1.githubusercontent.com/u/7725225?v=4" width="100px;" alt=""/><br /><sub><b>Sivasubramanyam A</b></sub></a></td>
    <td align="center"><a href="https://alexdiliberto.com"><img src="https://avatars0.githubusercontent.com/u/666459?v=4" width="100px;" alt=""/><br /><sub><b>Alex DiLiberto</b></sub></a></td>
    <td align="center"><a href="https://github.com/Dhaulagiri"><img src="https://avatars1.githubusercontent.com/u/1672302?v=4" width="100px;" alt=""/><br /><sub><b>Brian Runnells</b></sub></a></td>
    <td align="center"><a href="https://jenweber.github.io/portfolio/"><img src="https://avatars1.githubusercontent.com/u/16627268?v=4" width="100px;" alt=""/><br /><sub><b>Jen Weber</b></sub></a></td>
    <td align="center"><a href="http://hakilebara.com"><img src="https://avatars2.githubusercontent.com/u/1991564?v=4" width="100px;" alt=""/><br /><sub><b>Frédéric Soumaré</b></sub></a></td>
    <td align="center"><a href="http://kiwiupover.com"><img src="https://avatars3.githubusercontent.com/u/647691?v=4" width="100px;" alt=""/><br /><sub><b>David Laird</b></sub></a></td>
  </tr>
  <tr>
    <td align="center"><a href="http://www.lumialabs.com"><img src="https://avatars2.githubusercontent.com/u/533152?v=4" width="100px;" alt=""/><br /><sub><b>Daan van Etten</b></sub></a></td>
    <td align="center"><a href="https://github.com/tcjr"><img src="https://avatars3.githubusercontent.com/u/142243?v=4" width="100px;" alt=""/><br /><sub><b>Tom Carter</b></sub></a></td>
    <td align="center"><a href="http://summerisgone.com"><img src="https://avatars0.githubusercontent.com/u/106999?v=4" width="100px;" alt=""/><br /><sub><b>Ivan Gromov</b></sub></a></td>
    <td align="center"><a href="https://github.com/ro0gr"><img src="https://avatars2.githubusercontent.com/u/875361?v=4" width="100px;" alt=""/><br /><sub><b>Ruslan Hrabovyi</b></sub></a></td>
    <td align="center"><a href="https://alexlafroscia.com"><img src="https://avatars2.githubusercontent.com/u/1645881?v=4" width="100px;" alt=""/><br /><sub><b>Alex LaFroscia</b></sub></a></td>
    <td align="center"><a href="https://github.com/ljknight"><img src="https://avatars.githubusercontent.com/u/11436149?v=4" width="100px;" alt=""/><br /><sub><b>Laura Knight</b></sub></a></td>
    <td align="center"><a href="https://betocantu93.com/"><img src="https://avatars.githubusercontent.com/u/9092644?v=4" width="100px;" alt=""/><br /><sub><b>Alberto Cantú Gómez</b></sub></a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/SergeAstapov"><img src="https://avatars.githubusercontent.com/u/322983?v=4" width="100px;" alt=""/><br /><sub><b>Sergey Astapov</b></sub></a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

## 🆓 License

This project is distributed under the MIT license.

---

GitHub [@ivanvotti](https://github.com/ivanvotti) &nbsp;&middot;&nbsp;
Twitter [@ivanvotti](https://twitter.com/ivanvotti)
