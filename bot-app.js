require('dotenv').config();

const rateLimit = require('telegraf-ratelimit')

const math = require("mathjs")
const { re } = require("mathjs")

const { isEnglish, isTooLong } = require("./app/utils/validators")
const replies = require("./app/utils/replies")


const chatBot = require("./app/chat-bot")
const inlineBot = require("./app/inline-bot")


const Question = require("./app/Question")
const EchoTestAnswerer = require("./app/EchoTestAnswerer")


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

    //  your bot logic
    bot.start((ctx) => {
        ctx.replyWithMarkdown(replies.start)
    })

    bot.command("examples", async (ctx) => {
        for (const msg of replies.examples) {
            await ctx.reply(msg)
        }
    })

    /////////////////Answer question
    const answerQuestion = async (ctx, question, currentBot, answerMethod) => {

        currentBot.ctx = ctx;

        if (isTooLong(question)) {
            return currentBot.replyTooLong()
        }

        currentBot.msgId = ctx.update.message ? ctx.update.message.message_id : null
        currentBot.question = question

        if (isEnglish(question)) {

            if (question.split(" ").length < 3) {
                return currentBot.replyTooShort()
            }

            return await currentBot[answerMethod]();

        } else {
            try {
                currentBot.mathResult = math.evaluate(question)
                return currentBot.replyMath()
            } catch (e) {

                if (/[\d-+/*/^]/g.test(question)) { //\d
                    return await currentBot.replyExpression()
                } else {
                    return currentBot.replyInvalid()
                }
            }
        }
    }

    /////////////////chatBot Events (commands)
    bot.hears(/^\!\bmes\b$/, (ctx) => {
        const msgId = ctx.update.message.message_id
        ctx.reply("Don't forget to write your question after !mes, for example:\n!mes how big is the moon?", { reply_to_message_id: msgId })
    })

    bot.hears(/^\!\bmes\b\s+.*/, async (ctx) => {

        const userInput = ctx.message.text
        // console.log(userInput)
        const question = userInput.replace(/\!mes\s+/, "")
        // console.log(question)
        await answerQuestion(ctx, question, chatBot, "writeSpokenAnswer")
    })



    bot.hears(/^\!\bvoi\b$/, (ctx) => {
        const msgId = ctx.update.message.message_id
        ctx.reply("Don't forget to write your question after !voi, for example:\n!voi how big is the moon?", { reply_to_message_id: msgId })
    })

    bot.hears(/^\!\bvoi\b\s+.*/, async (ctx) => {

        const userInput = ctx.message.text
        // console.log(userInput)
        const question = userInput.replace(/\!voi\s+/, "")
        // console.log(question)
        await answerQuestion(ctx, question, chatBot, "speakSpokenAnswer")
    })


    /////////////////inlineBot Events (commands)
    bot.on("inline_query", async (ctx) => {

        const question = ctx.inlineQuery.query
        // console.log(question)

        await answerQuestion(ctx, question, inlineBot, "replySpokenAnswer")
    })


    // bot.on('text', (ctx) => {

    //     const text = ctx.update.message.text

    //     // const question = new Question(text)

    //     // console.log(question.getInfo())

    //     const test = new EchoTestAnswerer(ctx, text)

    //     test.answer()

    // })

}