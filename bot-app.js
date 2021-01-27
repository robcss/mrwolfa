const { Telegraf } = require('telegraf')
const { synthesizeVoice } = require("./apis/text-to-speech")

module.exports = (bot) => {

    //error handling
    bot.catch((err, ctx) => {
        console.log(`Ooops, encountered an error for ${ctx.updateType}`, err)
        ctx.reply("Something's wrong with my circuits :(")
    })

    //your bot logic
    const msg = "This is a telegram bot boileplate and everything seems to be working fine"

    bot.start((ctx) => {
        ctx.reply('Welcome')
        ctx.reply(msg)
    })

    bot.on('text', async (ctx) => {

        const text = ctx.update.message.text
        const audioContent = await synthesizeVoice(text)


        ctx.replyWithVoice({
            source: audioContent
        })

    })

}