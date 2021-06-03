const {Message, MessageAttachment} = require('discord.js')
const canvacord = require('canvacord')

module.exports = {
    name: 'spank',
    desc: 'Spanks a mentioned user',
    expectedArgs: '<@user>',
    parameters: `\`<@user>\`: mention or username or discord ID of the user\n**Note:** If the user is not specified or not found, then the author of message is spanked`,
    category: 'Image Manipulation',
    /**
     * 
     * @param {Message} message 
     * @param {[String]} args 
     */
    run: async (message, args) => {
        let target = message.mentions.users.first()
        if(!target){
            if(args.length > 0) {
                const u = args.join(' ').toLowerCase()
                target = message.client.users.resolve(u)
                if(!target){
                    target = message.client.users.cache.find(
                        us => us.username.toLowerCase() === u
                                || us.tag.toLowerCase() === u
                    )
                }
            }
        }
        if(!target){
            target = message.author
        }
        const uavatar = message.author.displayAvatarURL({format: 'png'})
        const tavatar = target.displayAvatarURL({format: 'png'})
        const spanked = await canvacord.Canvas.spank(uavatar, tavatar).catch(console.error)
        message.channel.send(
            new MessageAttachment(
                spanked,
                `${message.author.username}_spanks_${target.username}.png`
            )
        ).catch(console.error)
    }
}