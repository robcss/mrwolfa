require('dotenv').config();

const langDetector = new (require('languagedetect'));

module.exports.isEnglish = (text) => {
    const test = langDetector.detect(text, 1)[0]
    if (!test) {
        return false
    } else {
        return test[0] === "english"
    }
}


const maxChars = process.env.WOLFRAM_QUERY_MAXCHARS

module.exports.isTooLong = (text) => {
    return text.length >= maxChars
}