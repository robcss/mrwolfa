const Question = require("./Question")

class Answerer {
    constructor(ctx, questionText) {
        this.ctx = ctx;
        this.question = new Question(questionText);
        this.mathResult = null;
    }

    async answer() {

        if (this.question.isTooLong()) return this.answerTooLong()


        if (this.question.isEnglish()) {

            if (this.question.isTooShort()) return this.answerTooShort()

            return await this.answerEnglish()
        }


        this.mathResult = this.question.evaluatedAsMath()

        if (this.mathResult) return this.answerMath()

        if (this.question.resemblesExpression()) return this.answerExpression()


        return this.answerInvalid()

    }

}


module.exports = Answerer

