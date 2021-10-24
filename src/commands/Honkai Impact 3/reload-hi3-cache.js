const {Message, MessageEmbed} = require('discord.js')
const loadHi3cache = require('$utils/Honkai Impact 3/load-cache')

module.exports = {
    name: 'reload-hi3-cache',
    desc: 'Reloads HI3 cache, which includes the valks, natues and characters.',
    ownerOnly: true,
    category: 'Honkai Impact 3',
    /**
     * 
     * @param {Message} message 
     * @param {[String]} args 
     */
    run: (message, args) => {
        const { channel } = message
        if (loadHi3cache()) {
            channel.send('Succeessfully updated cache.').catch(console.error)
        } else {
            channel.send('Failed to update cache!').catch(console.error)
        }
    }
}