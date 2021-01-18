require('dotenv').config();

const { Telegraf } = require('telegraf')

const token = process.env.BOT_TOKEN
const myPort = process.env.PORT || 3000
const hookUrl = process.env.HOOK_URL

const environment = process.env.NODE_ENV

const botApp = require("./bot-app")
const botLaunch = require("./bot-launch")

if (token === undefined) {
    throw new Error('BOT_TOKEN must be provided!')
}

const bot = new Telegraf(token)

const app = (botUrl, botPort) => {
    botApp(bot);
    botLaunch(bot, botUrl, botPort);
    console.log(`Environment: ${environment}\nWebhook:${botUrl}\nPort:${botPort}`)
}

if (environment === "production") {

    app(hookUrl, myPort)

} else if (environment === "development") {
    //run app setting a tunnel to localhost as the webhook
    const ngrok = require('ngrok');

    ngrok.connect(myPort)
        .then(localUrl => {
            app(localUrl, myPort)
        })
        .catch(e => {
            console.log("Ngrok error")
            console.log(e)
        })
}
