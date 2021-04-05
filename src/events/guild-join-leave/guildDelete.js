const {Client} = require('discord.js')
const {prefixes} = require('$collections')
const cmdPrefixSchema = require('$models/command-prefix-schema')

/**
 * 
 * @param {Client} client 
 */
module.exports = (client) => {
    client.on('guildDelete', async (guild) => {
        const res = await cmdPrefixSchema.findByIdAndDelete(guild.id).catch(console.error)
        if(!res){
            console.error(`Cannot delete prefix from database after leaving ${guild.name}`)
            return
        }
        prefixes.delete(guild.id)
    })
}