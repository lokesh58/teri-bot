const {Message, MessageEmbed} = require('discord.js')
const translator = require('@iamtraction/google-translate')
const ISO6391 = require('iso-639-1')

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
            const res = await translator(text, {to:'en'}).catch(console.error)
            if(!res){
                return message.reply('Some error occurred. Please try again!').catch(console.error)
            }
            const {channel, author} = message
            const embed = new MessageEmbed()
                                .setTitle('Translation Results')
                                .setDescription(
                                    `**Detected Language**: ${ISO6391.getName(res.from.language.iso)}`
                                ).addField('Translated From',
                                    res.from.text.value || text
                                ).addField('Translation Result', res.text)
                                .setColor('RANDOM')
                                .setFooter(
                                    `Requested by ${author.tag}`,
                                    author.displayAvatarURL({dynamic: true})
                                )
                                .setTimestamp()
            channel.send(embed).catch(console.error)
        }
    }
}