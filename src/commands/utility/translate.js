const {Message} = require('discord.js')
const translator = require('@iamtraction/google-translate')

module.exports = {
    name: 'translate',
    aliases: ['tl'],
    desc: 'Translates the given text to english',
    expectedArgs: '<text to translate>',
    parameters: `\`<text to translate>\`: The text which will be translated to english`,
    category: 'utility',
    /**
     * 
     * @param {Message} message 
     * @param {[String]} args 
     */
    run: async (message, args) => {
        if(args.length === 0){
            message.reply('Please speicify the text to translate!').catch(console.error)
        }else{
            const text = args.join(' ')
            const tltext = await translator(text, {to:'en'}).catch(console.error)
            if(!tltext){
                message.reply('Some error occurred. Please try again!').catch(console.error)
            }else{
                message.reply(tltext.text).catch(console.error)
            }
        }
    }
}