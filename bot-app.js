require('dotenv').config();

const { Telegraf, Markup } = require('telegraf')
const rateLimit = require('telegraf-ratelimit')
const math = require("mathjs")

const { isEnglish, isTooLong } = require("./utils/validators")
const replies = require("./utils/replies")

const { synthesizeVoice } = require("./apis/text-to-speech")
const { re } = require('mathjs')

const maxCallbackTime = process.env.MAX_CALLBACK_TIME

module.exports = (bot) => {

    //error handling
    bot.catch((err, ctx) => {
        console.log(`Ooops, encountered an error for ${ctx.updateType}`, err)
        ctx.reply(replies.error)
    })

    // rate limiting
    // Set limit to 1 message per 1 second
    const limitConfig = {
        window: 1000,
        limit: 2,
        onLimitExceeded: (ctx, next) => {
            try {
                ctx.reply(replies.exceed)
            } catch {
                console.log(replies.exceed)
            }

        }
    }

    bot.use(rateLimit(limitConfig))

    //  your bot logic
    bot.start((ctx) => {
        ctx.reply(replies.start)
    })

    //ask question in private chat
    ///^\!ask\s?.*/
    ///^\!\bask\b$ matcha senza spazio
    //^\!\bask\b\s+.* matcha solo con spazio + qualunqe cosa

    bot.hears(/^\!\bask\b$/, (ctx) => {
        ctx.reply("Don't forget to write your question after !ask, for example:\n!ask how big is the moon?")
    })

    bot.hears(/^\!\bask\b\s+.*/, (ctx) => {


        const userInput = ctx.message.text
        console.log(userInput)

        const question = userInput.replace(/!ask\s+/, "")
        console.log(question)

        if (isTooLong(question)) {
            return ctx.reply(replies.tooLong)
        }

        const msgId = ctx.update.message.message_id

        if (isEnglish(question)) {

            const btns = Markup.inlineKeyboard([
                Markup.button.callback(replies.textButton, 'Text'),
                Markup.button.callback(replies.voiceButton, 'Voice')
            ]).reply_markup

            ctx.reply(replies.chooseAnswer, { reply_to_message_id: msgId, reply_markup: btns })

        } else {
            try {
                const mathResult = math.evaluate(question)
                ctx.reply(`${replies.math} ${mathResult}`, { reply_to_message_id: msgId })
            } catch {
                if (/\d/.test(question)) {
                    ctx.reply("Wolfram alpha Short Answer API")
                } else {
                    ctx.reply(replies.askAgain, { reply_to_message_id: msgId })
                }
            }
        }

    })

    //middleware that checks if callback is called too late
    const checkCallbackTime = (ctx, next) => {
        const elapsedTimeFromCallbackQuery = (Date.now() / 1000) - ctx.update.callback_query.message.date //in seconds

        const msgId = ctx.update.callback_query.message.message_id

        if (elapsedTimeFromCallbackQuery > maxCallbackTime) {
            return ctx.reply(replies.lateCallback, { reply_to_message_id: msgId })
        } else {
            next()
        }

    }

    bot.action("Text", checkCallbackTime, (ctx) => {

        const userInput = ctx.update.callback_query.message.reply_to_message.text
        const question = userInput.replace(/!ask?\s+/, "")

        ctx.reply("Wolfram alpha Short Answer API")
    })


    bot.action("Voice", checkCallbackTime, (ctx) => {
        const userInput = ctx.update.callback_query.message.reply_to_message.text
        const question = userInput.replace(/!ask?\s+/, "")

        ctx.reply("Wolfram alpha Spoken Answer API")
    })

    //inline bot logic 
    bot.on("inline_query", async (ctx) => {

        console.log(ctx.inlineQuery.query)

        const results = [{
            type: 'article',
            id: "test id",
            title: "test title",
            description: "test description",
            // thumb_width: 10,
            // thumb_height: 10,
            url: "",
            thumb_url: "https://upload.wikimedia.org/wikipedia/en/thumb/1/17/Wolfram_Language_Logo_2016.svg/1200px-Wolfram_Language_Logo_2016.svg.png",
            input_message_content: {
                message_text: `Question: ${ctx.inlineQuery.query}`
            }
            // reply_markup: Markup.inlineKeyboard([
            //     Markup.button.callback('TEST', "test")
            // ]).reply_markup
        }]

        return await ctx.answerInlineQuery(results)
    })


    // bot.action('test', (ctx) => {
    //     const chatId = ctx.update.callback_query.chat_instance
    //     console.log(ctx)
    //     // ctx.telegram.sendMessage(chatId, "success")
    //     return ctx.answerCbQuery(`Oh, ${ctx.match[0]}! Great choice`)
    // })


    // bot.on('text', async (ctx) => {

    //     const text = ctx.update.message.text
    //     // const audioContent = await synthesizeVoice(text)


    //     // ctx.replyWithVoice({
    //     //     source: audioContent
    //     // })
    // })

}