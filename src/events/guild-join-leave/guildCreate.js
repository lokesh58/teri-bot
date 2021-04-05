const {Client, MessageEmbed} = require('discord.js')
const getPrefix = require('$utils/getPrefix')

/**
 * 
 * @param {Client} client 
 */
module.exports = (client) => {
    client.on('guildCreate', async (guild) => {
        const prefix = await getPrefix(guild.id)
        if(!prefix){
            console.error(`Added to guild ${guild.name} but unable to create a prefix`)
            prefix = process.env.DEFAULT_PREFIX
        }
        const embed = new MessageEmbed()
                            .setTitle(`Thank You for Inviting me to ${guild.name} 😁`)
                            .setDescription(
                                `My prefix here is: \`${prefix}\`
                                Use \`${prefix}help\` to get a list of all my commands
                                Use \`${prefix}prefix\` to change my prefix`
                            ).setColor('RANDOM')
                            .setTimestamp()
        guild.systemChannel?.send(embed).catch(console.error)
    })
}