# Games AI UI

## What is it?
This is a prototype web application built with react js to provide UI for strategy games that could be played against an AI.

The AI itself runs in the backend web service - https://github.com/cant12/games-ai-UI

You can find the most recent version at http://play.gamesai.co.in/

## How do I set up?
Its simple! 

Copy the local config properties
```
cd games-ai-UI
cp src/resources/config-local.json src/resources/config.json
```

Install node dependencies and start the server
```
npm install
npm start
```

**Note**: Its preferable to have node version 16 or greater.

## How do I deploy?
The web server is currently hosted in the aws ec2 instance. At this stage, the deployment is mostly mannual. We might automate it based on future needs.

Get the permission file ("games-ai-key-pair.pem") from the owner and save it in your .ssh folder. 

Then, login to the ec2 machine using the following command
```
./gamesai-ssh
```

Once you are in, pull the latest code and restart the server using the following steps

```
cd /opt/games-ai-UI

git checkout main
git pull origin main

npm install

pm2 restart GamesAI
```

**Note**: Make sure that the config file ("src/resources/config.json") has the right values before deploying