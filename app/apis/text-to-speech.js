require('dotenv').config()
// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech');

//authentication
const keysEnvVar = process.env.GOOGLE_CREDS

if (!keysEnvVar) {
    throw new Error("The $GOOGLE_CREDS environment variable was not found!")
}

const { project_id, client_email, private_key } = JSON.parse(keysEnvVar)

const private_key_clean = private_key.replace(/\\n/gm, '\n')

const clientOptions = {
    projectId: project_id,
    credentials: {
        client_email,
        private_key: private_key_clean
    }
}

// Creates a client
const client = new textToSpeech.TextToSpeechClient(clientOptions);

module.exports.synthesizeVoice = async (text) => {
    // text = The text to synthesize

    const wavenetVoice = "en-GB-Wavenet-D"
    const standardVoice = "en-GB-Standard-D"
    // Construct the request
    const request = {
        input: { text: text },
        // Select the language and SSML voice gender (optional)
        voice: { languageCode: 'en-GB', name: standardVoice, ssmlGender: 'MALE' },
        // select the type of audio encoding
        audioConfig: { audioEncoding: 'OGG_OPUS' },
    };

    // Performs the text-to-speech request
    const [response] = await client.synthesizeSpeech(request);

    // console.log('voice synthesized');

    return response.audioContent
}
