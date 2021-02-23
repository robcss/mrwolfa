const { getWolframSpoken } = require("./apis/wolfram-alpha")

const { synthesizeVoice } = require("./apis/text-to-speech")


module.exports.answerEnglishWithText = async (ctx, questionText, replyConfig) => {

    const { result } = await getWolframSpoken(questionText)
    return ctx.reply(result, replyConfig)
}

module.exports.answerEnglishWithVoice = async (ctx, questionText, replyConfig) => {
    try {

        const { result, failed } = await getWolframSpoken(questionText)

        if (failed) {
            throw new Error(result)
        }

        const audioContent = await synthesizeVoice(result)

        return ctx.replyWithVoice({ source: audioContent }, replyConfig)

    } catch (error) {
        return ctx.reply(error.message, replyConfig)
    }
}

