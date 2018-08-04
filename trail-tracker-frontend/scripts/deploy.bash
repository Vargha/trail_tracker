#!/usr/bin/env bash

#
# This is the a script used to deploy the application to Heroku. All code is compiled prior to deployment.
#


set -e

outdir=/tmp/__TRAIL_TRACKER_FRONTEND_DEPLOY__/

npm run build

if [ $1 == "test" ]; then
    test=true
else
    test=false
fi

rm -rf ${outdir}
mkdir ${outdir}

cp deploy/deploy-package.json ${outdir}/package.json
cp build/* ${outdir} -r
cd ${outdir}

echo "Output build directory: ${outdir}"

if [ ${test} == true ]; then
    npm start
    exit
fi

git init
git add -A
git commit -m "Deploy"

heroku git:remote -a trailtrackerapp
git push -f heroku master
