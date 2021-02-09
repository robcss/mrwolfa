require('dotenv').config();

const { Telegraf, Markup } = require('telegraf')
const rateLimit = require('telegraf-ratelimit')
const math = require("mathjs")
const { re } = require("mathjs")

const { isEnglish, isTooLong } = require("./utils/validators")
const replies = require("./utils/replies")
const thumbs = require("./utils/thumbnails")

const { synthesizeVoice } = require("./apis/text-to-speech")

const WolframAlphaAPI = require('wolfram-alpha-api');
const waApi = WolframAlphaAPI(process.env.WOLFRAM_APP_ID);




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
    const getWolframSpoken = async (question) => {
        try {
            console.log("waApi call")
            return await waApi.getSpoken(question)
        } catch (error) {
            console.log(error)
            return error.message
        }
    }

    const getWolframShort = async (question) => {
        try {
            console.log("waApi call")
            return await waApi.getShort(question)
        } catch (error) {
            console.log(error)
            return error.message
        }
    }

    const writeSpokenAnswer = async (ctx, question, msgId) => {
        ctx.reply("Computing...")
        const result = await getWolframSpoken(question)
        return ctx.reply(result, { reply_to_message_id: msgId })

    }

    const writeShortAnswer = async (ctx, question, msgId) => {
        ctx.reply("Computing...")
        const result = await getWolframShort(question)
        return ctx.reply(result, { reply_to_message_id: msgId })
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


    //////chatBot methods
    const chatBot = {

        replyTooLong: function () {
            return this.ctx.reply(replies.tooLong)
        },

        replyGetAnswer: async function () {
            return await this.getAnswer(this.ctx, this.question, this.msgId)
        },

        replyMath: function () {
            return this.ctx.reply(`${replies.math} ${this.mathResult}`, { reply_to_message_id: this.msgId })
        },

        replyExpression: async function () {
            return await writeShortAnswer(this.ctx, this.question, this.msgId)
        },

        replyInvalid: function () {
            return this.ctx.reply(replies.invalidQuestion, { reply_to_message_id: this.msgId })
        }

    }


    //////chatBot methods
    const inlineBot = {

        replyTooLong: function () {
            const answer = replies.tooLong
            const results = [{
                type: 'article',
                id: "tooLong",
                title: replies.inlineTitle,
                description: answer,
                url: "",
                thumb_url: thumbs.wolframLogo,
                input_message_content: {
                    message_text: answer
                }
            }]

            return this.ctx.answerInlineQuery(results)
        },

        replyGetAnswer: async function () {
            const answer = await this.getAnswer(this.question) //getWolframSpoken
            const results = [{
                type: 'article',
                id: "getAnswer",
                title: replies.inlineTitle,
                description: answer,
                url: "",
                thumb_url: thumbs.wolframLogo,
                input_message_content: {
                    message_text: answer
                }
            }]

            return await this.ctx.answerInlineQuery(results)
        },

        replyMath: function () {
            const answer = this.mathResult ? `${replies.math} ${this.mathResult}` : "Waiting for a valid question :)"
            const results = [{
                type: 'article',
                id: "math",
                title: replies.inlineTitle,
                description: answer,
                url: "",
                thumb_url: thumbs.wolframLogo,
                input_message_content: {
                    message_text: answer
                }
            }]

            return this.ctx.answerInlineQuery(results)
        },

        replyExpression: async function () {
            const answer = await getWolframShort(this.question)
            const results = [{
                type: 'article',
                id: "expression",
                title: replies.inlineTitle,
                description: answer,
                url: "",
                thumb_url: thumbs.wolframLogo,
                input_message_content: {
                    message_text: answer
                }
            }]

            return await this.ctx.answerInlineQuery(results)
        },

        replyInvalid: function () {
            const answer = replies.invalidQuestion
            const results = [{
                type: 'article',
                id: "invalid",
                title: replies.inlineTitle,
                description: answer,
                url: "",
                thumb_url: thumbs.wolframLogo,
                input_message_content: {
                    message_text: answer
                }
            }]

            return this.ctx.answerInlineQuery(results)
        }

    }


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
        await answerQuestion(ctx, question, chatBot, writeSpokenAnswer)
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
        await answerQuestion(ctx, question, chatBot, speakSpokenAnswer)
    })




    //inline bot logic 
    bot.on("inline_query", async (ctx) => {

        const question = ctx.inlineQuery.query
        console.log(question)

        await answerQuestion(ctx, question, inlineBot, getWolframSpoken)
    })



}