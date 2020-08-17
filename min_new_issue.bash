#!/usr/bin/env bash
# min_new_issue.bash

  #'https://gitlab.com/kiprasmel/refined-gitlab/-/issues' \

SAMPLE_PROJECT_ID="20434942" \
SAMPLE_ACTION="issues?title=issue%5Btitle%5B=test+issue+4.6&labels=bug" \
GITLAB_SESSION_TOKEN="<the value of _gitlab_session cookie"
GITLAB_CSRF_KEY="authenticity_token" \
GITLAB_CSRF_TOKEN="<the value of the authenticity_token" \
curl -L \
  'https://gitlab.com/api/v4/projects/$SAMPLE_PROJECT_ID/$SAMPLE_ACTION' \
  -H 'cookie: _gitlab_session=$GITLAB_SESSION_TOKEN' \
  --data-raw '$GITLAB_CSRF_KEY=$GITLAB_CSRF_TOKEN'


curl -L \
  'https://gitlab.com/api/v4/projects/20434942/issues?title=issue%5Btitle%5B=test+issue+4.6&labels=bug' \
  -H 'cookie: _gitlab_session=ec6920f673b58e0b92d3f634c217fb47' \
  --data-raw 'authenticity_token=QO9CIi%2FWZ1dVcdkrlJo%2Bp9%2Bu2E8moWYDM3ndQ8hoDY3j9s3c7g0kSRGQPTVFcxNdOKXvtTTOFc9d0Zov3AV8Yg%3D%3D'


# curl --request POST --header "PRIVATE-TOKEN: <your_access_token>" "https://gitlab.example.com/api/v4/projects/4/issues?title=Issues%20with%20auth&labels=bug"

D38rNYEeQ8ibTyBA7bFbrZ1mptEgEGVxDE4HyPVh6Pqw=

<meta name="csrf-param" content="authenticity_token" />
<meta name="csrf-token" content="5xW35SbKd3p0YWyljWU9+ho8GfP7KgYlLCzO0B5tVx3jQBgRqIQMzB0FA6ft5oz847RzwuAaBjhq15OM3DM7Rg==" />
