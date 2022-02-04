#!/bin/bash

set -f 
string=$APP_SERVER_URLS
array=(${string//,/ })
echo "Deploy"

    echo "Deploy on  instance1"
    ssh -v -o ProxyCommand="ssh -v -W %h:%p -i ~/.ssh/id_deploy $DEPLOY_SERVER_USER@$DEPLOY_SERVER_URL" -i ~/.ssh/id_rsa_app $APP_SERVER_USER@${array[0]}  "cd Enzo/checkin_front/gitlab/repo/checkin_frontend && sudo git pull https://${1}:${2}@gitlab.com/enzo-software-development/checkin_frontend develop && sudo npm install"

