# refined-gitlab

Much like [refined github](https://github.com/sindresorhus/refined-github), but for gitlab!

## Try it from local build

```sh
git clone https://github.com/kiprasmel/refined-gitlab.git
# or:  git clone git@github.com:kiprasmel/refined-gitlab.git

cd refined-gitlab/

yarn
```

Inside [./source/utils/config.ts](./source/utils/config.ts) add your gitlab's `API token` & `host URL`; then

```sh
yarn dev
```

And then load up the built extension:

- firefox:

```
about:debugging#/runtime/this-firefox
```

- chrome:

```
chrome://extensions
```

& try it out.

## License

MIT © [Kipras Melnikovas](https://gitlab.com/kiprasmel)
