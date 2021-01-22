# local-dev-server

authenticating manually everytime is annoying. Now it's automated.

## auto auth

- run `yarn dev` in the root of `refined-gitlab`
- be logged into gitlab via your normal browser
- visit any page of gitlab via your normal browser
- refresh the temporary web extension development browser window

done. you're logged in. works like magic.

## technical notes

we cache your auth "package" (session & login cookies + csrf token) and inject it into the browser that is not authenticated.
