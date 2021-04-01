const getPrefix = require('$utils/getPrefix')
const checkPermission = require('$utils/checkPermission')
const parse = require('$utils/parse-arguments')

module.exports = (client) => {
    client.on('message', async (message) => {
        if (message.author.bot || message.channel.type === 'dm') return
        const prefix = await getPrefix(message.guild.id)
        if(!prefix) return //Some error retriving prefix, abort command execution
        if(!message.content.toLowerCase().startsWith(prefix)) return
        const args = parse(message.content.slice(prefix.length).trim())
        const cmdName = args.shift().toLowerCase()
        const cmd = client.commands.get(cmdName) || client.commands.get(client.aliases.get(cmdName))
        if(cmd) {
            //Check if user needs any special permissions to run the command
            if(!checkPermission(message.member, cmd))
                return //Member doesn't have required permission, so abort command execution
            console.log(`Running command ${cmd.name}`)
            cmd.run(message, args)
        }else{
            //If not valid command, tell the user
            message.reply(`\`${cmdName}\` is not a valid command. Use help command to view all valid commands!`).then(msg => {
                msg.delete({timeout: 5000}).catch(console.error)
            }).catch(console.error)
        }
    })
}