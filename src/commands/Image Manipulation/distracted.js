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
    name: 'distracted',
    desc: 'Create distracted boyfriend meme with new faces',
    expectedArgs: '<@user1> <@user2> (<@user3>)',
    parameters: `\`<@user1>\`: face for girl in red color\n\`<@user2>\`: face for the boy\n\`(<@user3>)\`: optional, face for the other girl\n**Note:** If a required user is not specified or not found, then the author of message is used`,
    category: 'Image Manipulation',
    /**
     * 
     * @param {Message} message 
     * @param {[String]} args 
     */
    run: async (message, args) => {
        const {client} = message
        const users = message.mentions.users.first(3)
        for(let i=0; i<3; ++i){
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
        const u3 = users[2]?.displayAvatarURL({format: 'png'})
        const meme = await canvacord.Canvas.distracted(u1, u2, u3).catch(console.error)
        message.channel.send(
            new MessageAttachment(
                meme,
                `distracted_boyfriend.png`
            )
        ).catch(console.error)
    }
}