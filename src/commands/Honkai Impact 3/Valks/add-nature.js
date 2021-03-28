const {Message, Emoji} = require('discord.js')

/**
 * 
 * @param {Message} message
 * @param {String} name 
 * @param {Emoji} emoji 
 */
const addNature = async (message, name, emoji) => {
    //TODO
}

module.exports = {
    name: 'add-nature',
    aliases: ['addnature', 'add_nature'],
    desc: 'Add a new valkyrja nature',
    expectedArgs: '<name> <emoji>',
    parameters:
        `\`<name>\`: Name of the new nature, should not be same as an already existing one
        \`<emoji>\`: Emoji of the new nature, should not be same as an already existing one`,
    ownerOnly: true,
    category: 'Honkai Impact 3',
    /**
     * 
     * @param {Message} message 
     * @param {[String]} args 
     */
    run: (message, args) => {
        if (!args[0]) {
            message.reply('Please specify the name of the nature').catch(console.error)
            return
        }
        if (!args[1]) {
            message.reply('Please specify an emoji for the nature').catch(console.error)
            return
        }
        const name = args[0].toLowerCase()
        const emoji = (args[1].match(/<a?:.+?:\d+>/))[0]
        if (!emoji) {
            message.reply('Please specify a valid emoji for the nature').catch(console.error)
            return
        }
        const emojiID = emoji.match(/\d+/).pop()
        const {client} = message
        const fixemoji = client.emojis.cache.get(emojiID)
        if (!fixemoji) {
            message.reply('I don\'t have access to that emote. Please use another one.')
            return
        }
        addNature(message, name, fixemoji)
    }
}