
# mrwolfa
A Wolfram|Alpha powered Telegram bot.

Try it on Telegram:  https://t.me/mrwolfabot

![enter image description here](https://storage.googleapis.com/mrwolfa-thumbs/facebook_cover_photo_2.png)


## Features

  - Answers to almost any question Wolfram|Alpha can ( [What can you ask Wolfram|Alpha about?](https://www.wolframalpha.com/examples/) )
  
- Private chat commands to choose between a text message or a voice message answer
 - Works as an [inline bot](https://core.telegram.org/bots/inline) too: ask something and share the answer in any chat, no need to add it anywhere

## Usage
### Private chat
- `/start` - Sends welcome message and info on how to use it
- `/examples` - Sends some example questions to copy paste and try
-  `!mes your question text` - Answers to the question with a text message
- `!voi your question text` - Answers to the question with a voice message

The answer will be a text message regardless of the `!voi` command being used if: 
- Question does not produce a correct answer
- Question is identified as a math expression or equation
 
### Inline mode
In any of your chats just type `@mrwolfabot your question` in the message field.
Tap or click on the resulting answer panel to send both question and answer to the chat you're in.

**Important**: don't use !mes and !voi commands, just type the question.

## More info on questions (i.e. how to be sure to get an answer)
### Not every question gets a Wolfram|Alpha answer
In order to avoid wasting calls to the Wolfram|Alpha api, a question filter is implemented.
A question will not be forwarded to Wolfram|Alpha if:

- It has too many characters, answer will be a warning
- It's not recognized as proper english, answer will be a warning
- It's recognized as english but is less than 3 words long, answer will be a warning
- It's a *simple* math expression, answer will be evaluated by [Math.js](https://www.npmjs.com/package/mathjs)

### English questions
English questions need to be first recognized as english by the question filter, then understood by Wolfram|Alpha.
These rules of thumb work well for both steps:

1. Do not omit the Five Ws (who, what, when...)
- "average human height" :x:
- "what is the average human height"  :heavy_check_mark:

These rules will be expanded in the future as the question filter is improved.

For more details about what questions Wolfram|Alpha can understand see: https://www.wolframalpha.com/examples/


## Built with:

 - [Node.js](https://nodejs.org/en/)
 - [Telegraf.js](https://telegraf.js.org/)
 - [wolfram-alpha-api](https://products.wolframalpha.com/api/libraries/javascript/)
 - [@google-cloud/text-to-speech](https://www.npmjs.com/package/@google-cloud/text-to-speech)
 - [languagedetect](https://www.npmjs.com/package/languagedetect)
 - [Math.js](https://www.npmjs.com/package/mathjs)

## To do
- Add  Wolfram|Alpha Full Results API answer option
- Improve question filter
- Support questions without commands and add navigable menu
## Acknowledgments


- Sohil Pandya - [Authenticating Google service account securely and with Heroku](https://medium.com/@sohilpandya/authenticating-google-service-account-securely-and-with-heroku-a0fdc9da9138)
- Free logo by https://hatchful.shopify.com/

