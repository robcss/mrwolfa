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
            this.article.description = replies.inlineWelcome
            this.article.input_message_content.message_text = `Q: ${this.question}\nA: ${replies.inlineInvalid}`
        }

        return this.ctx.answerInlineQuery([this.article], { switch_pm_text: replies.inlineSwitchPrivate, switch_pm_parameter: "start" })
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