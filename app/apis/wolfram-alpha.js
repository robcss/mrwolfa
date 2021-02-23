require('dotenv').config()

const replies = require("../utils/replies")
const waErrors = require("../utils/waErrors")

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

    const response = {
        result: null,
        failed: null
    }

    for ([i, waApi] of waApis.entries()) {
        try {
            console.log(`waApi call: ${method} - Attempt with instance: ${i}`)
            response.result = await waApicall(waApi)
            response.failed = false
            return response
        } catch (error) {

            if (error.message !== waErrors.invalidAppId) {
                console.log(error.message)
                response.result = error.message
                response.failed = true
                return response
            }

            console.log(`waApi call: ${method} - Instance ${i} failed - Retrying with instance ${i + 1}`)
        }
    }

    response.result = replies.failed
    response.failed = true
    return response

}


module.exports.getWolframSpoken = async (question) => {
    return await getWolfram(question, "spoken")
}

module.exports.getWolframShort = async (question) => {
    return await getWolfram(question, "short")
}