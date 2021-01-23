
# telegraf-bot-boilerplate

A simple [Node.js](https://nodejs.org/en/) boilerplate for developing Telegram bots with [Telegraf.js](https://telegraf.js.org/) and easily deploying to [Heroku](https://www.heroku.com/).

## Features

  - Runs your bot in webhook mode in your local environment (using [Ngrok](https://www.npmjs.com/package/ngrok)) 
  - Ready for deployment to Heroku


## Installation
### Get the repository
By cloning it:
 ```
 $ git clone https://github.com/robcss/telegraf-bot-boilerplate.git
  ```

Or by creating a new repository from the template:

[![template.png](https://i.postimg.cc/tR585fy3/template.png)](https://postimg.cc/SjnZQgnR)

See the [github docs](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/creating-a-repository-from-a-template#creating-a-repository-from-a-template) for more information on using templates.
### Install dependencies
Cd to the repo and install dependencies
```
$ npm install
```
## Run the bot locally
### Set up development config variables

Create a **.env** file in your directory and set up the following environment variables:
```
BOT_TOKEN=yourbottoken
PORT=yourport
NODE_ENV=development
```
NODE_ENV must be set to "development" in order to run the bot locally using Ngrok.

### Run the app
**Write all your bot logic inside [bot-app.js](https://github.com/robcss/telegraf-bot-boilerplate/blob/master/bot-app.js "bot-app.js")**.

Run the app:
```
$ node index.js
```
Console should log this:
```
Environment: development
Webhook: https://yourpublicurl.ngrok.io
Port: yourport
```
Your bot should now be up and ready to get updates from Telegram!
### How to confirm webhook status
You can check the status of the webhook with a GET  request of 
```https://api.telegram.org/bot<yourbottoken>/getWebhookInfo ``` 

Telegram API should reply with: 
```
{
 "ok":true,
 "result": 
 {
   "url":"https://yourpublicurl.ngrok.io",
   "has_custom_certificate":false,
   "pending_update_count":0,
   "max_connections":40.
   "ip_address":"12.345.67.89"
 }
}
```
## Deploy to Heroku
### Prerequisites
* Sign up to Heroku
* Download the [Heroku Command Line Interface (CLI)](https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up)

### Create app
In your personal dashboard click on **New** > **Create new app**

[![createapp.png](https://i.postimg.cc/mgC6Sr2h/createapp.png)](https://postimg.cc/K1cNGxTy)

Give your app a name and create it

[![createapp2.png](https://i.postimg.cc/SKTSmV0B/createapp2.png)](https://postimg.cc/NyXq46jD)

### Set production config variables
In your app page go to **Settings**, down to **Config Vars** and click on **Reveal Config Vars**

[![config.png](https://i.postimg.cc/sDBLvckY/config.png)](https://postimg.cc/7fk9RgYh)

Set HOOK_URL to your app url, which you can find down on the same page under the **Domains** section.

Set BOT_TOKEN to your bot token.

PORT will be set automatically by Heroku.

NODE_ENV will be set to "production" by Heroku.

### Login to Heroku via CLI
```
$ heroku login
```

### Deploy with Git
Cd to your repository and push your latest commit
```
$ git add .
$ git commit -m "first deploy"
$ git push heroku master
```
Your bot should now be up and live on Telegram!

Rembember you can check the status of the webhook with a GET  request of 
```https://api.telegram.org/bot<yourbottoken>/getWebhookInfo ``` 

## Built with:

 - [Node.js](https://nodejs.org/en/)
 - [Telegraf.js](https://telegraf.js.org/)
 - [Ngrok](https://github.com/bubenshchykov/ngrok#readme) (Node.js wrapper)

## Acknowledgments

 - [micro-bot](https://github.com/telegraf/micro-bot) for inspiration

