const Answerer = require("./Answerer")

const thumbs = require("./utils/thumbnails")
const replies = require("./utils/replies")

const { getWolframSpoken, getWolframShort } = require("./apis/wolfram-alpha")

class InlineAnswerer extends Answerer {
    constructor(ctx, questionText) {
        super(ctx, questionText)
        this.questionText = questionText
        this.article = {
            type: 'article',
            id: "default",
            title: "default",
            description: "default",
            url: "",
            thumb_url: thumbs.wolframLogo,
            input_message_content: {
                message_text: "default"
            }
        }
    }

    getQAReply(answer) {
        return `Q: ${this.questionText}\nA: ${answer}`
    }

    setArticle(title, description, messageText) {
        this.article.title = title
        this.article.description = description
        this.article.input_message_content.message_text = messageText
    }

    answerInline(title, description, messageText, replyConfig = {}) {
        this.setArticle(title, description, messageText)
        return this.ctx.answerInlineQuery([this.article], replyConfig)
    }

    answerInlineQAReply(title, description, messageText, replyConfig = {}) {
        const qaReply = this.getQAReply(messageText)
        return this.answerInline(title, description, qaReply, replyConfig)
    }

    answerTooLong() {
        return this.answerInline("Too Long!", replies.tooLong, replies.tooLong)
    }

    answerTooShort() {
        return this.answerInlineQAReply("Too Short!", replies.tooShort, replies.tooShort)
    }

    async answerEnglish() {
        const { result, failed } = await getWolframSpoken(this.questionText)

        const title = failed ? replies.inlineTitleFailed : replies.inlineTitleAnswer

        return this.answerInlineQAReply(title, result, result)
    }

    answerMath() {
        return this.answerInlineQAReply(replies.inlineTitleAnswer, `${replies.math} ${this.mathResult}`, this.mathResult)
    }

    async answerExpression() {
        const { result, failed } = await getWolframShort(this.questionText)

        const title = failed ? replies.inlineTitleFailed : replies.inlineTitleAnswer
        const description = failed ? result : `${replies.math} ${result}`

        return this.answerInlineQAReply(title, description, result)
    }

    answerInvalid() {

        let title = "Invalid question!"
        let description = replies.invalidQuestion
        let replyConfig = {}

        if (this.questionText === "" | this.questionText === " ") {
            title = replies.inlineTitleAsk
            description = replies.inlineWelcome
            replyConfig = { switch_pm_text: replies.inlineSwitchPrivate, switch_pm_parameter: "start" }
        }

        return this.answerInlineQAReply(title, description, replies.inlineInvalid, replyConfig)
    }

}

module.exports = InlineAnswerer