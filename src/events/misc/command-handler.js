const getPrefix = require('$utils/getPrefix')
const checkPermission = require('$utils/checkPermission')
const {parse} = require('shell-quote')

module.exports = (client) => {
    client.on('message', async (message) => {
        if (message.author.bot || message.channel.type === 'dm') return
        const prefix = await getPrefix(message.guild.id)
        if(!prefix) return //Some error retriving prefix, abort command execution
        if(!message.content.toLowerCase().startsWith(prefix)) return
        //replace < with \< and > with \> because they are special characters for parse, hence need escape characters
        const args = parse(message.content.slice(prefix.length).trim().replace('<','\\<').replace('>', '\\>'))
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