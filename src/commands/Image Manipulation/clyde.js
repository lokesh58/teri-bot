const {Message, MessageAttachment} = require('discord.js')
const canvacord = require('canvacord')

module.exports = {
    name: 'clyde',
    desc: 'Clyde for given text',
    expectedArgs: '<text>',
    parameters: `\`<text>\`: The text for which Change My Mind is needed`,
    category: 'Image Manipulation',
    /**
     * 
     * @param {Message} message 
     * @param {[String]} args 
     */
    run: async (message, args) => {
        if(!args[0]){
            return message.reply('Please specify the text!').catch(console.error)
        }
        const text = args.join(' ')
        const res = await canvacord.Canvas.clyde(text).catch(console.error)
        message.channel.send(
            new MessageAttachment(
                res,
                `clyde.png`
            )
        ).catch(console.error)
    }
}