module.exports = {
    name: 'ping',
    desc: 'Returns the average ping to the bot\'s websocket',
    run: (message, args) => {
        const {channel, client} = message
        channel.send(`The average ping to websocket is ${client.ws.ping}`).catch(console.error)
    }
}