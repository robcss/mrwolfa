const { Telegraf } = require('telegraf')

module.exports = (bot, botUrl, myPort) => {

    //set and start webhook
    bot.launch({
        webhook: {
            domain: botUrl,
            port: myPort
        }
    })

    // Enable graceful stop
    process.once('SIGINT', () => bot.stop('SIGINT'))
    process.once('SIGTERM', () => bot.stop('SIGTERM'))

}