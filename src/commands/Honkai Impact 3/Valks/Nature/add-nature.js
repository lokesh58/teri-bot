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
    if (result) {
        //Either name or emoji already exists
        message.reply('The name or emoji already used in another nature!').catch(console.error)
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
    valkNature.set(result._id.toString(), result)
    const {author, channel} = message
    const embed = new MessageEmbed()
                        .setTitle('Add Nature Successful')
                        .setDescription(
                            `*The following nature has been added*\n**Name:** \`${capitalize(result.name)}\`\n**Emoji:** ${result.emoji}`
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
    desc: 'Add a new valkyrie battlesuit nature to database',
    expectedArgs: '<name> <emoji>',
    parameters:
        `\`<name>\`: Name of the new nature\n\`<emoji>\`: Emoji of the new nature`,
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
        addNature(message, name, emoji[0])
    }
}