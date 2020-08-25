#!/usr/bin/env bash
# preupload.bash

bash ./postupload.bash

get_ver() {
	ver="$(node -e 'console.log(require("./package.json").version)')"
	echo "v$ver"
}

newVer="$(get_ver)"

yarn web-ext build --source-dir distribution/

dir="$(basename $(pwd))"
cd ../
zip refined-gitlab-source.zip "./$dir/"
mv  refined-gitlab-source.zip "./$dir/web-ext-artifacts/"
cd "$dir"

printf "\n\n"
printf " https://addons.mozilla.org/en-US/developers/addon/refined-gitlab/versions/submit/ \n"
printf " https://gitlab.com/kiprasmel/refined-gitlab/-/compare/vOLD...$newVer \n"
printf "\n\n"

printf "./postupload.bash\n\n\n"
