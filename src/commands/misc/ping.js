const {Message} = require('discord.js')

module.exports = {
    name: 'ping',
    desc: 'Returns the average ping to the bot\'s websocket',
    category: 'misc',
    /**
     * 
     * @param {Message} message 
     * @param {[String]} args 
     */
    run: (message, args) => {
        const {channel, client} = message
        channel.send(`The average ping to websocket is ${client.ws.ping}ms`).catch(console.error)
    }
}