module.exports = {
    name: 'ping',
    desc: 'Returns the average ping to the bot\'s websocket',
    category: 'misc',
    run: (message, args) => {
        const {client} = message
        message.reply(`The average ping to websocket is ${client.ws.ping}ms`).catch(console.error)
    }
}