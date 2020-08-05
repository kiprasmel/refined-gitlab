# refined-gitlab

Much like [refined github](https://github.com/sindresorhus/refined-github), but for gitlab!

## Try it from local build

Note - downloading a `.zip` won't work - do exactly as described below (you'll need `git` and `yarn`).

Inside your terminal:

```sh
git clone https://github.com/kiprasmel/refined-gitlab.git
# or:  git clone git@github.com:kiprasmel/refined-gitlab.git

cd refined-gitlab/

yarn install
```

> wait a bit. This will install the dependencies & clone git submodules

Inside [./source/utils/config.ts](./source/utils/config.ts) add your gitlab's `host URL` & `API token` (found at `<gitlab_host>/profile/personal_access_tokens`) with scopes `api` & `read_api`);

then:

```sh
yarn build # you need to do this every time you update something inside this repository
```

And then load up the built extension:

## chrome:

navigate to

```
chrome://extensions
```

1. enable "Developer mode" (toggle @ top right)
1. click "Load unpacked" (top left)
1. navigate to the path where you cloned the repository at first step
1. navigate to the `distribution/` folder & click "Select"

done! Note that after shutting down the browser, you'll need to load the extension from the `distribution/` folder again (begin @ [#chrome](#chrome))

## firefox:

navigate to

```
about:debugging#/runtime/this-firefox
```

1. click "Load Temporary Add-on..."
1. navigate to the path where you cloned the repository at first step
1. navigate to the `distribution/` folder
1. select any file & double-click it

done! Note that after shutting down the browser, you'll need to load the extension from the `distribution/` folder again (begin @ [#firefox](#firefox))



## License

MIT © [Kipras Melnikovas](https://gitlab.com/kiprasmel)
