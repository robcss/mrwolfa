const replies = require("./utils/replies")

const { synthesizeVoice } = require("./apis/text-to-speech")

const { getWolframSpoken, getWolframShort } = require("./apis/wolfram-alpha")

//////chatBot
module.exports = {

    ctx: null,
    msgId: null,
    question: null,
    mathResult: null,

    replyTooLong: function () {
        return this.ctx.reply(replies.tooLong)
    },

    replyTooShort: function () {
        return this.ctx.reply(replies.tooShort, { reply_to_message_id: this.msgId })
    },

    writeSpokenAnswer: async function () {
        this.ctx.reply("Computing...")
        const result = await getWolframSpoken(this.question)
        return this.ctx.reply(result, { reply_to_message_id: this.msgId })

    },

    writeShortAnswer: async function () {
        this.ctx.reply("Computing...")
        const result = await getWolframShort(this.question)
        return this.ctx.reply(`${replies.math} ${result}`, { reply_to_message_id: this.msgId })
    },

    speakSpokenAnswer: async function () {
        try {
            this.ctx.reply("Computing...")

            const result = await getWolframSpoken(this.question)

            if (result === replies.cantUnderstand) {
                throw Error(replies.cantUnderstand)
            } else if (result === replies.failed) {
                throw Error(replies.failed)
            }

            const audioContent = await synthesizeVoice(result)

            return this.ctx.replyWithVoice({
                source: audioContent
            }, { reply_to_message_id: this.msgId })

        } catch (error) {
            return this.ctx.reply(error.message, { reply_to_message_id: this.msgId })
        }

    },

    replyMath: function () {
        return this.ctx.reply(`${replies.math} ${this.mathResult}`, { reply_to_message_id: this.msgId })
    },

    replyExpression: async function () {
        return await this.writeShortAnswer()
    },

    replyInvalid: function () {
        return this.ctx.reply(replies.invalidQuestion, { reply_to_message_id: this.msgId })
    }

}