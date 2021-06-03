const {Message, MessageAttachment} = require('discord.js')
const canvacord = require('canvacord')

module.exports = {
    name: 'sepia',
    desc: 'Sepia wash on a mentioned user',
    expectedArgs: '<@user>',
    parameters: `\`<@user>\`: mention or username or discord ID of the user\n**Note:** If the user is not specified or not found, then the author of message is used`,
    category: 'Image Manipulation',
    /**
     * 
     * @param {Message} message 
     * @param {[String]} args 
     */
    run: async (message, args) => {
        let user = message.mentions.users.first()
        if(!user){
            if(args.length > 0) {
                const u = args.join(' ').toLowerCase()
                user = message.client.users.resolve(u)
                if(!user){
                    user = message.client.users.cache.find(
                        us => us.username.toLowerCase() === u
                                || us.tag.toLowerCase() === u
                    )
                }
            }
        }
        if(!user){
            user = message.author
        }
        const avatar = user.displayAvatarURL({format: 'png'})
        const sepia = await canvacord.Canvas.sepia(avatar).catch(console.error)
        message.channel.send(
            new MessageAttachment(
                sepia,
                `${user.username}_sepia.png`
            )
        ).catch(console.error)
    }
}