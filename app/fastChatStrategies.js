const { getWolframSpoken } = require("./apis/wolfram-alpha")

const { synthesizeVoice } = require("./apis/text-to-speech")

const replies = require("./utils/replies")


module.exports.answerEnglishWithText = async (ctx, questionText, replyConfig) => {

    const result = await getWolframSpoken(questionText)
    return ctx.reply(result, replyConfig)
}

module.exports.answerEnglishWithVoice = async (ctx, questionText, replyConfig) => {
    try {

        const result = await getWolframSpoken(questionText)

        if (result === replies.cantUnderstand) {
            throw Error(replies.cantUnderstand)
        } else if (result === replies.failed) {
            throw Error(replies.failed)
        }

        const audioContent = await synthesizeVoice(result)

        return ctx.replyWithVoice({ source: audioContent }, replyConfig)

    } catch (error) {
        return ctx.reply(error.message, replyConfig)
    }
}

