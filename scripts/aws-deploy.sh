gulp build:prod
timestamp=$(date +%s)
random=$RANDOM
app_version="$timestamp"-"$RANDOM"
filename=dist-"$app_version".zip
echo $filename
zip -q -r $filename ./.babelrc ./app.js ./package.json ./dist ./server-code ./shared-code
aws s3 cp ./$filename s3://wordhub-deploy/elastic-beanstalk-wordhub/
rm -f ./$filename
aws elasticbeanstalk create-application-version --application-name wordhub --version-label dev-"$app_version" --source-bundle S3Bucket="wordhub-deploy",S3Key="elastic-beanstalk-wordhub/$filename"
aws elasticbeanstalk update-environment --application-name wordhub --environment-name wordhub-env --version-label dev-"$app_version"
