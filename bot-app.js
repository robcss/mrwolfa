require('dotenv').config();

const rateLimit = require('telegraf-ratelimit')

const replies = require("./app/utils/replies")

const { answerEnglishWithText, answerEnglishWithVoice } = require("./app/fastChatStrategies")
const FastChatAnswerer = require("./app/FastChatAnswerer")

const InlineAnswerer = require("./app/InlineAnswerer");


module.exports = (bot) => {

    //error handling
    bot.catch((err, ctx) => {
        console.log(`Ooops, encountered an error for ${ctx.updateType}`, err)
        ctx.reply(replies.error)
    })

    // rate limiting
    // Set limit to 2 message per 1 second
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

    //  bot logic
    bot.start((ctx) => {
        ctx.replyWithMarkdown(replies.start)
    })

    bot.command("examples", async (ctx) => {
        for (const msg of replies.examples) {
            await ctx.reply(msg)
        }
    })

    // chatBot
    bot.hears(/^\!\bmes\b$/, (ctx) => {
        const msgId = ctx.update.message.message_id
        ctx.reply(replies.noQuestionMes, { reply_to_message_id: msgId })
    })

    bot.hears(/^\!\bmes\b\s+.*/, async (ctx) => {

        const userInput = ctx.message.text

        const question = userInput.replace(/\!mes\s+/, "")

        const fastWriterChatBot = new FastChatAnswerer(ctx, question, answerEnglishWithText)

        await fastWriterChatBot.answer()
    })



    bot.hears(/^\!\bvoi\b$/, (ctx) => {
        const msgId = ctx.update.message.message_id
        ctx.reply(replies.noQuestionVoi, { reply_to_message_id: msgId })
    })

    bot.hears(/^\!\bvoi\b\s+.*/, async (ctx) => {

        const userInput = ctx.message.text

        const question = userInput.replace(/\!voi\s+/, "")

        const fastSpeakerChatBot = new FastChatAnswerer(ctx, question, answerEnglishWithVoice)

        await fastSpeakerChatBot.answer()
    })


    // inlineBot 
    bot.on("inline_query", async (ctx) => {

        const question = ctx.inlineQuery.query

        const inlineBot = new InlineAnswerer(ctx, question)

        await inlineBot.answer()
    })

}