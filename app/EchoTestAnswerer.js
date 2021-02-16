
const Answerer = require("./Answerer")


class EchoTestAnswerer extends Answerer {
    constructor(ctx, questionText) {
        super(ctx, questionText)
        this.questionText = questionText
    }

    answerTooLong() {
        return this.ctx.reply(`${this.questionText} is too long`)
    }


    answerTooShort() {
        return this.ctx.reply(`${this.questionText} is too short`)
    }

    async answerEnglish() {
        return await this.ctx.reply(`${this.questionText} is english`)
    }

    answerMath() {
        return this.ctx.reply(`${this.questionText} is ${this.mathResult}`)
    }

    answerExpression() {
        return this.ctx.reply(`${this.questionText} is expression`)
    }


    answerInvalid() {
        return this.ctx.reply(`${this.questionText} is invalid`)
    }
}

module.exports = EchoTestAnswerer