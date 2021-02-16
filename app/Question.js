require('dotenv').config();

const maxChars = process.env.WOLFRAM_QUERY_MAXCHARS;

const langDetector = new (require('languagedetect'));
const math = require("mathjs")
const { re } = require("mathjs")

class Question {
    constructor(text) {
        this.text = text;
    }

    isTooLong() {
        return this.text.length >= maxChars
    }

    isTooShort() {
        return this.text.split(" ").length < 3
    }

    isEnglish() {
        const test = langDetector.detect(this.text, 1)[0]
        if (!test) {
            return false
        } else {
            return test[0] === "english"
        }
    }

    evaluatedAsMath() {
        try {
            return math.evaluate(this.text)
        } catch (e) {
            return null
        }
    }

    resemblesExpression() {
        return /[\d-+/*/^]/g.test(this.text)
    }

    getInfo() {
        return {
            text: this.text,
            tooLong: this.isTooLong(),
            tooShort: this.isTooShort(),
            english: this.isEnglish(),
            math: this.evaluatedAsMath(),
            expression: this.resemblesExpression()
        }
    }
}

module.exports = Question