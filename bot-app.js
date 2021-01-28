const { Telegraf } = require('telegraf')
const rateLimit = require('telegraf-ratelimit')
const { synthesizeVoice } = require("./apis/text-to-speech")

module.exports = (bot) => {

    //error handling
    bot.catch((err, ctx) => {
        console.log(`Ooops, encountered an error for ${ctx.updateType}`, err)
        ctx.reply("Something's wrong with my circuits :(")
    })

    //rate limiting
    // Set limit to 1 message per 0.8 second
    const limitConfig = {
        window: 800,
        limit: 1,
        onLimitExceeded: (ctx, next) => ctx.reply('Rate limit exceeded')
    }

    bot.use(rateLimit(limitConfig))

    //your bot logic
    bot.start((ctx) => {
        ctx.reply('Welcome')
        ctx.reply(msg)
    })

    bot.on('text', async (ctx) => {

        const text = ctx.update.message.text
        // const audioContent = await synthesizeVoice(text)


        // ctx.replyWithVoice({
        //     source: audioContent
        // })
        console.log(text)

    })

}