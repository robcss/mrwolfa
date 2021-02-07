require('dotenv').config();

const { Telegraf, Markup } = require('telegraf')
const rateLimit = require('telegraf-ratelimit')
const math = require("mathjs")

const { isEnglish, isTooLong } = require("./utils/validators")
const replies = require("./utils/replies")

const { synthesizeVoice } = require("./apis/text-to-speech")
const { re } = require('mathjs')

const WolframAlphaAPI = require('wolfram-alpha-api');
const waApi = WolframAlphaAPI(process.env.WOLFRAM_APP_ID);


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

    /////////////////Answers
    const getSpokenAnswer = async (ctx, question, msgId) => {
        try {
            ctx.reply("Computing...")
            const result = await waApi.getSpoken(question)
            return ctx.reply(result, { reply_to_message_id: msgId })
        } catch (error) {
            return ctx.reply(error.message, { reply_to_message_id: msgId })
        }
    }

    const getShortAnswer = async (ctx, question, msgId) => {
        try {
            ctx.reply("Computing...")
            const result = await waApi.getShort(question)
            return ctx.reply(result, { reply_to_message_id: msgId })
        } catch (error) {
            return ctx.reply(error.message, { reply_to_message_id: msgId })
        }
    }

    const speakSpokenAnswer = async (ctx, question, msgId) => {

        try {
            ctx.reply("Computing...")

            const result = await waApi.getSpoken(question)

            const audioContent = await synthesizeVoice(result)

            return ctx.replyWithVoice({
                source: audioContent
            }, { reply_to_message_id: msgId })

        } catch (error) {
            return ctx.reply(error.message, { reply_to_message_id: msgId })
        }

    }

    /////////////////Answer question
    const answerQuestion = async (ctx, question, getAnswer) => {

        if (isTooLong(question)) {
            return ctx.reply(replies.tooLong)
        }

        const msgId = ctx.update.message.message_id

        if (isEnglish(question)) {

            return await getAnswer(ctx, question, msgId)

        } else {
            try {
                const mathResult = math.evaluate(question)
                return ctx.reply(`${replies.math} ${mathResult}`, { reply_to_message_id: msgId })
            } catch {
                if (/\d/.test(question)) {
                    return await getShortAnswer(ctx, question, msgId)
                } else {
                    return ctx.reply(replies.askAgain, { reply_to_message_id: msgId })
                }
            }
        }
    }

    /////////////////Events (commands)
    bot.hears(/^\?\bmes\b$/, (ctx) => {
        const msgId = ctx.update.message.message_id
        ctx.reply("Don't forget to write your question after ?mes, for example:\n?mes how big is the moon?", { reply_to_message_id: msgId })
    })

    bot.hears(/^\?\bmes\b\s+.*/, async (ctx) => {

        const userInput = ctx.message.text
        // console.log(userInput)
        const question = userInput.replace(/\?mes\s+/, "")
        // console.log(question)
        await answerQuestion(ctx, question, getSpokenAnswer)
    })



    bot.hears(/^\?\bvoi\b$/, (ctx) => {
        const msgId = ctx.update.message.message_id
        ctx.reply("Don't forget to write your question after ?voi, for example:\n?voi how big is the moon?", { reply_to_message_id: msgId })
    })

    bot.hears(/^\?\bvoi\b\s+.*/, async (ctx) => {

        const userInput = ctx.message.text
        // console.log(userInput)
        const question = userInput.replace(/\?voi\s+/, "")
        // console.log(question)
        await answerQuestion(ctx, question, speakSpokenAnswer)
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
    //     const audioContent = await synthesizeVoice(text)


    //     ctx.replyWithVoice({
    //         source: audioContent
    //     })
    // })

}