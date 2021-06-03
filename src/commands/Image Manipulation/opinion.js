const {Message, MessageAttachment, Client} = require('discord.js')
const canvacord = require('canvacord')

/**
 * 
 * @param {Client} client 
 * @param {String} query 
 */
const findUser = (client, query) => {
    if(!query) return null
    query = query.toLowerCase()
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
    name: 'opinion',
    desc: 'Create opinion for a mentioned user',
    expectedArgs: '<@user> <opinion>',
    parameters: `\`<@user>\`: User giving opinion\n\`<opinion>\`: the opinion\n**Note:** If a required user is not specified or not found, then the author of message is used`,
    category: 'Image Manipulation',
    /**
     * 
     * @param {Message} message 
     * @param {[String]} args 
     */
    run: async (message, args) => {
        const {client} = message
        let user = message.mentions.users.first()
        const query = args.shift()
        if(!query) return message.reply('Please specify a user!').catch(console.error)
        if(!user) user = findUser(client, query)
        if(!user) user = message.author
        const avatar = user.displayAvatarURL({format: 'png'})
        const opinion = args.join(' ')
        if(!opinion) return message.reply('Please specify an opinion!').catch(console.error)
        const res = await canvacord.Canvas.opinion(avatar, opinion).catch(console.error)
        message.channel.send(
            new MessageAttachment(
                res,
                `opinion.png`
            )
        ).catch(console.error)
    }
}