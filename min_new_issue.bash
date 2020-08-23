#!/usr/bin/env bash
# min_new_issue.bash
#
# see https://github.com/jdalrymple/gitbeaker/issues/1098
#

curl -L \
  'https://gitlab.com/api/v4/projects/20434942/issues?title=test+issue+X&labels=fake' \
  -H 'cookie: _gitlab_session=ec6920f673b58e0b92d3f634c217fb47' \
  --data-raw 'authenticity_token=7LXkB6xu4Sb8/EYhQMUvOTjvUfFqbz6oEqNDEPdcvXLo4EvzIiCakJWYKSMgRp4/wWc7wHFfPrVUWB5MNQLRKQ=='


# curl --request POST --header "PRIVATE-TOKEN: <your_access_token>" "https://gitlab.example.com/api/v4/projects/4/issues?title=Issues%20with%20auth&labels=bug"

D38rNYEeQ8ibTyBA7bFbrZ1mptEgEGVxDE4HyPVh6Pqw=

<meta name="csrf-param" content="authenticity_token" />
<meta name="csrf-token" content="5xW35SbKd3p0YWyljWU9+ho8GfP7KgYlLCzO0B5tVx3jQBgRqIQMzB0FA6ft5oz847RzwuAaBjhq15OM3DM7Rg==" />
