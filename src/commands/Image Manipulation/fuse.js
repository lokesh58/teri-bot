const {Message, MessageAttachment, Client} = require('discord.js')
const canvacord = require('canvacord')

/**
 * 
 * @param {Client} client 
 * @param {String} query 
 */
const findUser = (client, query) => {
    if(!query) return null
    let user = client.users.resolve(query)
    if(!user){
        user = client.users.cache.find(
            us => us.username.toLowerCase() === query
                || us.tag.toLowerCase() === query
        )
    }
    return user
}

module.exports = {
    name: 'fuse',
    desc: 'Fuse pfp of two mentioned users',
    expectedArgs: '<@user1> <@user2>',
    parameters: `\`<@user1>\`: face for girl in red color\n\`<@user2>\`: face for the boy\n**Note:** If a user is not specified or not found, then the author of message is used`,
    category: 'Image Manipulation',
    /**
     * 
     * @param {Message} message 
     * @param {[String]} args 
     */
    run: async (message, args) => {
        const {client} = message
        const users = message.mentions.users.first(2)
        for(let i=0; i<2; ++i){
            if(!users[i]){
                users[i] = findUser(client, args[i])
            }
        }
        for(let i=0; i<2; ++i){
            if(!users[i]){
                users[i] = message.author
            }
        }
        const u1 = users[0].displayAvatarURL({format: 'png'})
        const u2 = users[1].displayAvatarURL({format: 'png'})
        const fused = await canvacord.Canvas.fuse(u1, u2).catch(console.error)
        message.channel.send(
            new MessageAttachment(
                fused,
                `fused_${users[0].username}_${users[1].username}.png`
            )
        ).catch(console.error)
    }
}