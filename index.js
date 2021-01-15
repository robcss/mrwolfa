require('dotenv').config();

const { Telegraf } = require('telegraf')

const token = process.env.BOT_TOKEN
const myPort = process.env.PORT
const url = process.env.URL

const enviroment = process.env.NODE_ENV

const botApp = require("./bot-app")
const botLaunch = require("./bot-launch")

if (token === undefined) {
    throw new Error('BOT_TOKEN must be provided!')
}

const bot = new Telegraf(token)

const app = (botUrl) => {
    botApp(bot);
    botLaunch(bot, botUrl, myPort);
    console.log(enviroment, botUrl, myPort)
}

if (enviroment === "production") {

    app(url)

} else if (enviroment === "development") {
    const ngrok = require('ngrok');
    const devMode = require("./utils/devmode");

    devMode(app, myPort)
}

// app(url)
// devMode(app)