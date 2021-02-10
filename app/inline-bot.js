const replies = require("./utils/replies")
const thumbs = require("./utils/thumbnails")

const { getWolframSpoken, getWolframShort } = require("./apis/wolfram-alpha")

//////inlineBot
module.exports = {

    ctx: null,
    question: null,
    mathResult: null,

    article: {
        type: 'article',
        id: "default",
        title: replies.inlineTitle,
        description: "default",
        url: "",
        thumb_url: thumbs.wolframLogo,
        input_message_content: {
            message_text: "default"
        }
    },

    replyTooLong: function () {
        const answer = replies.tooLong

        this.article.description = answer
        this.article.input_message_content.message_text = answer

        return this.ctx.answerInlineQuery([this.article])
    },

    replyTooShort: function () {
        const answer = replies.tooShort

        this.article.description = answer
        this.article.input_message_content.message_text = `Q: ${this.question}\nA: ${answer}`

        return this.ctx.answerInlineQuery([this.article])
    },

    replySpokenAnswer: async function () {
        const answer = await getWolframSpoken(this.question)

        this.article.description = answer
        this.article.input_message_content.message_text = `Q: ${this.question}\nA: ${answer}`

        return this.ctx.answerInlineQuery([this.article])
        // return this.ctx.answerInlineQuery({ results: [this.article], switch_pm_text: "switch" })
    },

    replyShortAnswer: async function () {
        const answer = await getWolframShort(this.question)

        this.article.description = `${replies.math} ${answer}`
        this.article.input_message_content.message_text = `Q: ${this.question}\nA: ${answer}`

        return this.ctx.answerInlineQuery([this.article])
    },

    replyMath: function () {

        if (this.mathResult) {
            this.article.description = `${replies.math} ${this.mathResult}`
            this.article.input_message_content.message_text = `Q: ${this.question}\nA: ${this.mathResult}`

        } else {
            this.article.description = "Waiting for a valid question :)"
            this.article.input_message_content.message_text = `Q: ${this.question}\nA: No valid question was asked! :(`
        }

        return this.ctx.answerInlineQuery([this.article])
    },

    replyExpression: async function () {
        return await this.replyShortAnswer()
    },

    replyInvalid: function () {
        const answer = replies.invalidQuestion

        this.article.description = answer
        this.article.input_message_content.message_text = `Q: ${this.question}\nA: ${answer}`

        return this.ctx.answerInlineQuery([this.article])
    }

}