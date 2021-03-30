const {Message, MessageEmbed} = require('discord.js')
const natureSchema = require('$models/Honkai Impact 3/nature-schema')
const {valkNature} = require('$collections')
const capitalize = require('$utils/string-capitalize')

/**
 * 
 * @param {Message} message 
 * @param {String} name 
 * @param {String} emoji 
 */
const addNature = async (message, name, emoji) => {
    //Check if name or emoji alreaady exists
    let result = valkNature.find(nature => nature.name === name || nature.emoji === emoji)
    if(!result) {
        result = await natureSchema.find({
            $or: [
                {name: name},
                {emoji: emoji}
            ]
        }).catch(console.error)
        if (!result) {
            message.reply('An error occured. Please try again!').catch(console.error)
            return
        }
        if(result.length > 0) {
            for(const nature of result) {
                valkNature.set(nature._id,{
                    name: nature.name,
                    emoji: nature.emoji
                })
            }
        }
        result = result[0]
    }
    if (result) {
        //Either name or emoji already exists
        message.reply('The name or emoji already used in another nature. Please check them.').catch(console.error)
        return
    }
    result = await new natureSchema({
        name: name,
        emoji: emoji
    }).save().catch(console.error)
    if(!result) {
        //Some error in writing to daatabase
        message.reply('Some error occured. Please try again.').catch(console.error)
        return
    }
    valkNature.set(result._id, {
        name: result.name,
        emoji: result.emoji
    })
    const {author, channel} = message
    const embed = new MessageEmbed()
                        .setTitle('Add Nature Successful')
                        .setDescription(
                            `*The following nature has been added*
                            **Name:** \`${capitalize(result.name)}\`
                            **Emoji:** ${result.emoji}`
                        ).setColor('00FF00')
                        .setFooter(
                            `Requested by ${author.tag}`,
                            author.displayAvatarURL({dynamic: true})
                        ).setTimestamp()
    channel.send(embed).catch(console.error)
}

module.exports = {
    name: 'add-nature',
    aliases: ['addnature', 'add_nature'],
    desc: 'Add a new valkyrja nature to database',
    expectedArgs: '<name> <emoji>',
    parameters:
        `\`<name>\`: Name of the new nature, should not be same as an already existing one
        \`<emoji>\`: Emoji of the new nature, should not be same as an already existing one`,
    ownerOnly: true,
    category: 'Honkai Impact 3',
    /**
     * 
     * @param {Message} message 
     * @param {[String]} args 
     */
    run: (message, args) => {
        if (!args[0]) {
            message.reply('Please specify the name of the nature').catch(console.error)
            return
        }
        if (!args[1]) {
            message.reply('Please specify an emoji for the nature').catch(console.error)
            return
        }
        const name = args[0].toLowerCase()
        let emoji = args[1].match(/<a?:.+?:\d+>/)
        if (!emoji) {
            message.reply('Please specify a valid emoji for the nature').catch(console.error)
            return
        }
        emoji = emoji[0]
        addNature(message, name, emoji)
    }
}