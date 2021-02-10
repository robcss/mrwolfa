require('dotenv').config();

const { Telegraf, Markup } = require('telegraf')
const rateLimit = require('telegraf-ratelimit')
const math = require("mathjs")
const { re } = require("mathjs")

const { isEnglish, isTooLong } = require("./app/utils/validators")
const replies = require("./app/utils/replies")

const { getWolframSpoken, getWolframShort } = require("./app/apis/wolfram-alpha")

const chatBot = require("./app/chat-bot")
const inlineBot = require("./app/inline-bot")


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
        limit: 1,
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

    /////////////////Answer question
    const answerQuestion = async (ctx, question, currentBot, getAnswer) => {

        currentBot.ctx = ctx;

        if (isTooLong(question)) {
            return currentBot.replyTooLong()
        }

        const msgId = ctx.update.message ? ctx.update.message.message_id : null

        currentBot.msgId = msgId
        currentBot.question = question

        if (isEnglish(question)) {
            // console.log("get answer")
            if (question.split(" ").length < 3) {
                return currentBot.replyTooShort()
            }

            currentBot.getAnswer = getAnswer
            return await currentBot.replyGetAnswer()

        } else {
            try {
                const mathResult = math.evaluate(question)
                // console.log("math")
                currentBot.mathResult = mathResult
                return currentBot.replyMath()
            } catch (e) {
                // console.log(e)
                if (/\d/.test(question)) {
                    // console.log("expression")
                    return await currentBot.replyExpression()
                } else {
                    return currentBot.replyInvalid()
                }
            }
        }
    }

    /////////////////Chatbot Events (commands)
    bot.hears(/^\?\bmes\b$/, (ctx) => {
        const msgId = ctx.update.message.message_id
        ctx.reply("Don't forget to write your question after ?mes, for example:\n?mes how big is the moon?", { reply_to_message_id: msgId })
    })

    bot.hears(/^\?\bmes\b\s+.*/, async (ctx) => {

        const userInput = ctx.message.text
        // console.log(userInput)
        const question = userInput.replace(/\?mes\s+/, "")
        // console.log(question)
        await answerQuestion(ctx, question, chatBot, chatBot.writeSpokenAnswer)
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
        await answerQuestion(ctx, question, chatBot, chatBot.speakSpokenAnswer)
    })


    //inline bot logic 
    bot.on("inline_query", async (ctx) => {

        const question = ctx.inlineQuery.query
        // console.log(question)

        await answerQuestion(ctx, question, inlineBot, inlineBot.getWolframSpoken)
    })


    // bot.on("text", (ctx) => {

    //     const userInput = ctx.message.text

    // })



}