const {Message, MessageAttachment} = require('discord.js')
const canvacord = require('canvacord')

module.exports = {
    name: 'bed',
    desc: 'Bed a mentioned user',
    expectedArgs: '<@user>',
    parameters: `\`<@user>\`: mention or username or discord ID of the user\n**Note:** If the user is not specified or not found, then the author of message is slapped`,
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
        const bed = await canvacord.Canvas.bed(uavatar, tavatar).catch(console.error)
        message.channel.send(
            new MessageAttachment(
                bed,
                `${message.author.username}_bed_${target.username}.png`
            )
        ).catch(console.error)
    }
}