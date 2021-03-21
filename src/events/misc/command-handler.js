module.exports = (client) => {
    client.on('message', (message) => {
        if (message.author.bot || message.channel.type === 'dm') return
        const prefix = process.env.DEFAULT_PREFIX
        //TODO: implement different prefix across servers using mongodb
        if(!message.content.startsWith(prefix)) return
        const args = message.content.slice(prefix.length).trim().split(/\s+/)
        const cmdName = args.shift().toLowerCase()
        const cmd = client.commands.get(cmdName) || client.commands.get(client.aliases.get(cmd))
        if(cmd) {
            console.log(`Running command ${cmd.name}`)
            cmd.run(message, args)
        }
    })
}