require('dotenv').config();

const { Telegraf } = require('telegraf')

const token = process.env.BOT_TOKEN
const myPort = process.env.PORT
const url = process.env.URL

const enviroment = process.env.NODE_ENV

app = (botUrl) => {

    if (token === undefined) {
        throw new Error('BOT_TOKEN must be provided!')
    }

    const bot = new Telegraf(token)

    bot.start((ctx) => ctx.reply('Welcome'))

    bot.on('text', (ctx) => console.log(ctx.update.message.text))

    bot.launch({
        webhook: {
            domain: botUrl,
            port: myPort
        }
    })

    // Enable graceful stop
    process.once('SIGINT', () => bot.stop('SIGINT'))
    process.once('SIGTERM', () => bot.stop('SIGTERM'))

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