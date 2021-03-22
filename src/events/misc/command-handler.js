const cmdPrefixSchema = require('../../models/command-prefix-schema')
const {prefixes} = require('../../collections')

const getPrefix = async (guildID) => {
    let prefix = prefixes.get(guildID)
    if (!prefix) {
        let result = await cmdPrefixSchema.findById(guildID).catch(console.error)
        if (!result) {
            // Prefix not in database, store the default one
            result = await new cmdPrefixSchema({
                _id: guildID,
                prefix: process.env.DEFAULT_PREFIX
            }).save().catch(console.error)
            if (!result) {
                // There was some error in writing to databse, abort
                return
            }
        }
        // Now we have the prefix, store in collection
        prefixes.set(guildID, result.prefix)
        prefix = result.prefix
    }
    return prefix
}

module.exports = (client) => {
    client.on('message', async (message) => {
        if (message.author.bot || message.channel.type === 'dm') return
        const prefix = await getPrefix(message.guild.id)
        if(!prefix) return //Some error retriving prefix, abort command execution
        if(!message.content.startsWith(prefix)) return
        const args = message.content.slice(prefix.length).trim().split(/\s+/)
        const cmdName = args.shift().toLowerCase()
        const cmd = client.commands.get(cmdName) || client.commands.get(client.aliases.get(cmdName))
        if(cmd) {
            //Check if user needs any special permissions to run the command
            const reqPerm = cmd.requiredPermissions
            if(reqPerm && Array.isArray(reqPerm)) {
                console.log(`Checking user permissions for running command ${cmd.name}`)
                for(const perm of reqPerm) {
                    if (!message.member.hasPermission(perm))
                        return //Member doesn't have required permission, so abort command execution
                }
            }
            console.log(`Running command ${cmd.name}`)
            cmd.run(message, args)
        }
    })
}