# local-dev-server

authenticating manually everytime is annoying. Now it's automated.

## auto auth (borrow your session from another browser)

- be logged into gitlab via your normal browser
- run `yarn dev` in the root of `refined-gitlab`
- visit any page of gitlab via your normal browser (assuming you're using the development build of `refined-gitlab`)
- refresh the temporary web-ext development browser

done. you're logged in. works like magic.

## technical notes

we cache your auth "package" (session & login cookies + csrf token) and inject it into the browser that is not authenticated. there's a whole round-trip from your normal browser to the local-dev-server (here) and then from the temporary browser to here and back. pretty sweet ngl - love making integrations like these

beware that the local-dev-server (this) serves your cached authentication (url & port configured @ [./local-dev-config.js](local-dev-config.js)) -- don't expose it outside of your local device to avoid leaking your credentials.
