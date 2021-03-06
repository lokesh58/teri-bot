const {Client, Message} = require('discord.js')
const getBlacklist = require('$utils/getBlacklist')
/**
 * 
 * @param {Client} client 
 */
module.exports = (client) => {
    client.on(
        'messageCreate',
        /**
         * 
         * @param {Message} message 
         */
        async (message) => {
            if (message.author.bot || message.channel.type === 'dm') return
            const {guild, author, content, channel} = message
            const blist = await getBlacklist(guild.id)
            const text = content.toLowerCase()
            let found = false
            for(const bword of blist){
                if(text.includes(bword)){
                    found = true
                    break
                }
            }
            if(found){
                message.delete({reason: 'Contains bad words'}).catch(console.error)
                channel.send(`${author}, your message was deleted due to: Contains bad words`).then(
                    (msg) => {
                        setTimeout(() => msg.delete().catch(console.error), 2000)
                    }
                ).catch(console.error)
            }
        }
    )
}