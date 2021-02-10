const replies = require("./utils/replies")
const thumbs = require("./utils/thumbnails")

const { getWolframSpoken, getWolframShort } = require("./apis/wolfram-alpha")


//////inlineBot
module.exports = {

    getWolframSpoken: getWolframSpoken,

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

    replyTooShort: function () {
        const answer = replies.tooShort
        const results = [{
            type: 'article',
            id: "tooShort",
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
                message_text: `Q: ${this.question}\nA: ${answer}`
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
                message_text: `Q: ${this.question}\nA: ${answer}`
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
                message_text: `Q: ${this.question}\nA: ${answer}`
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