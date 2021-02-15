require('dotenv').config()

const replies = require("../utils/replies")

const WolframAlphaAPI = require('wolfram-alpha-api');
const waProdId = process.env.NODE_ENV === "development" ? process.env.WOLFRAM_APP_ID_DEV : process.env.WOLFRAM_APP_ID
const waIds = [waProdId, ...process.env.WOLFRAM_APP_ID_BACKUP.split(",")]

const waApis = waIds.map(id => WolframAlphaAPI(id));


const getWolfram = async (question, method) => {

    const waApicall = async (instance) => {
        switch (method) {
            case "spoken":
                return await instance.getSpoken(question);
            case "short":
                return await instance.getShort(question);
        }
    }

    for ([i, waApi] of waApis.entries()) {
        try {
            console.log(`waApi call: ${method} - Attempt with instance: ${i}`)
            return await waApicall(waApi)
        } catch (error) {

            if (error.message !== "Error 1: Invalid appid") {
                console.log(error.message)
                return error.message
            }

            console.log(`waApi call: ${method} - Instance ${i} failed - Retrying with instance ${i + 1}`)
        }
    }

    return replies.failed

}

module.exports.getWolframSpoken = async (question) => {
    return await getWolfram(question, "spoken")
}

module.exports.getWolframShort = async (question) => {
    return await getWolfram(question, "short")
}