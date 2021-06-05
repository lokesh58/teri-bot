const {Client, Message} = require('discord.js')
const getBlacklist = require('$utils/getBlacklist')
/**
 * 
 * @param {Client} client 
 */
module.exports = (client) => {
    client.on(
        'message',
        /**
         * 
         * @param {Message} message 
         */
        async (message) => {
            if (message.author.bot || message.channel.type === 'dm') return
            const {guild, author, content, channel} = message
            const blist = await getBlacklist(guild.id)
            let found = false
            for(const bword of blist){
                if(content.includes(bword)){
                    found = true
                    break
                }
            }
            if(found){
                message.delete({reason: 'Contains bad words'}).catch(console.error)
                channel.send(`${author}, your message was deleted due to: Contains bad words`).then(
                    (msg) => {
                        msg.delete({timeout: 2000}).catch(console.error)
                    }
                ).catch(console.error)
            }
        }
    )
}