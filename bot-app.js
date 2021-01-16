const { Telegraf } = require('telegraf')

module.exports = (bot) => {

    //error handling
    bot.catch((err, ctx) => {
        console.log(`Ooops, encountered an error for ${ctx.updateType}`, err)
        ctx.reply("Something's wrong with my circuits :(")
    })

    //your bot logic
    bot.start((ctx) => ctx.reply('Welcome'))

    bot.on('text', (ctx) => {

        const msg = "This is a telegram bot boileplate and everything seems to be working fine"

        ctx.reply(msg)
    })

}