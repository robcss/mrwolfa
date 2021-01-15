const ngrok = require('ngrok');

module.exports = async (app, localPort) => {

    let localUrl = await ngrok.connect(localPort);

    app(localUrl);

}