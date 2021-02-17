const Answerer = require("./Answerer")

const replies = require("./utils/replies")

const { getWolframShort } = require("./apis/wolfram-alpha")

class FastChatAnswerer extends Answerer {
    constructor(ctx, questionText, answerEnglishStrategy) {
        super(ctx, questionText)
        this.questionText = questionText
        this.answerEnglishStrategy = answerEnglishStrategy
        this.replyConfig = { reply_to_message_id: ctx.update.message.message_id }
    }

    answerComputing() {
        this.ctx.reply("Computing...")
    }

    answerTooLong() {
        return this.ctx.reply(replies.tooLong)
    }


    answerTooShort() {
        return this.ctx.reply(replies.tooShort, this.replyConfig)
    }

    async answerEnglish() {
        this.answerComputing()
        return await this.answerEnglishStrategy(this.ctx, this.questionText, this.replyConfig)
    }

    answerMath() {
        return this.ctx.reply(`${replies.math} ${this.mathResult}`, this.replyConfig)
    }

    async answerExpression() {
        this.answerComputing()
        const result = await getWolframShort(this.questionText)
        return this.ctx.reply(`${replies.math} ${result}`, this.replyConfig)

    }

    answerInvalid() {
        return this.ctx.reply(replies.invalidQuestion, this.replyConfig)
    }
}

module.exports = FastChatAnswerer