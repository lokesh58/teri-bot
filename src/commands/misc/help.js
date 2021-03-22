const {Message, MessageEmbed} = require('discord.js')

module.exports = {
    name: 'help',
    desc: 'Gives the list of commands or help regarding a specific command',
    category: 'misc',
    /**
     * 
     * @param {Message} message 
     * @param {[String]} args 
     */
    run: (message, args) => {
        message.reply('Under development').catch(console.error)
    }
}