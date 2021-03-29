const getPrefix = require('$utils/getPrefix')
const checkPermission = require('$utils/checkPermission')

module.exports = (client) => {
    client.on('message', async (message) => {
        if (message.author.bot || message.channel.type === 'dm') return
        const prefix = await getPrefix(message.guild.id)
        if(!prefix) return //Some error retriving prefix, abort command execution
        if(!message.content.toLowerCase().startsWith(prefix)) return
        const args = message.content.slice(prefix.length).trim().split(/\s+/)
        const cmdName = args.shift().toLowerCase()
        const cmd = client.commands.get(cmdName) || client.commands.get(client.aliases.get(cmdName))
        if(cmd) {
            //Check if user needs any special permissions to run the command
            if(!checkPermission(message.member, cmd))
                return //Member doesn't have required permission, so abort command execution
            console.log(`Running command ${cmd.name}`)
            cmd.run(message, args)
        }
    })
}