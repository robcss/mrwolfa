const replies = require("./utils/replies")

const { synthesizeVoice } = require("./apis/text-to-speech")

const { getWolframSpoken, getWolframShort } = require("./apis/wolfram-alpha")


const writeSpokenAnswer = async (ctx, question, msgId) => {
    ctx.reply("Computing...")
    const result = await getWolframSpoken(question)
    return ctx.reply(result, { reply_to_message_id: msgId })

}

const writeShortAnswer = async (ctx, question, msgId) => {
    ctx.reply("Computing...")
    const result = await getWolframShort(question)
    return ctx.reply(result, { reply_to_message_id: msgId })
}

const speakSpokenAnswer = async (ctx, question, msgId) => {

    try {
        ctx.reply("Computing...")

        const result = await getWolframSpoken(question)

        if (result === replies.cantUnderstand) {
            throw Error(replies.cantUnderstand)
        } else if (result === replies.failed) {
            throw Error(replies.failed)
        }

        const audioContent = await synthesizeVoice(result)

        return ctx.replyWithVoice({
            source: audioContent
        }, { reply_to_message_id: msgId })

    } catch (error) {
        return ctx.reply(error.message, { reply_to_message_id: msgId })
    }

}


//////chatBot
module.exports = {

    writeSpokenAnswer: writeSpokenAnswer,

    speakSpokenAnswer: speakSpokenAnswer,

    replyTooLong: function () {
        return this.ctx.reply(replies.tooLong)
    },

    replyTooShort: function () {
        return this.ctx.reply(replies.tooShort, { reply_to_message_id: this.msgId })
    },

    replyGetAnswer: async function () {
        return await this.getAnswer(this.ctx, this.question, this.msgId)
    },

    replyMath: function () {
        return this.ctx.reply(`${replies.math} ${this.mathResult}`, { reply_to_message_id: this.msgId })
    },

    replyExpression: async function () {
        return await writeShortAnswer(this.ctx, this.question, this.msgId)
    },

    replyInvalid: function () {
        return this.ctx.reply(replies.invalidQuestion, { reply_to_message_id: this.msgId })
    }

}