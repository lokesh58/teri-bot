const {Message, MessageEmbed} = require('discord.js')
const {valkBattlesuits} = require('$collections')
const valkSchema = require('$models/Honkai Impact 3/valk-schema')
const capitalize = require('$utils/string-capitalize')

/**
 * 
 * @param {Message} message 
 * @param {String} name 
 * @param {String} augEmoji 
 */
const addAug = async (message, name, augEmoji) => {
    const valk = valkBattlesuits.find(v => v.name === name || v.acronyms.includes(name))
    if(!valk){
        return message.reply('The valkyrie does not exist!').catch(console.error)
    }
    const res = await valkSchema.findByIdAndUpdate(valk._id, {
        augEmoji: augEmoji
    }, {
        new: true
    }).catch(console.error)
    if(!res){
        return message.reply('Some error occured. Please try again!').catch(console.error)
    }
    valkBattlesuits.set(res._id.toString(), res)
    const {author, channel} = message
    const embed = new MessageEmbed()
                        .setTitle('Add Augment Core Successful')
                        .setDescription(
                            `Augment core added for **${capitalize(res.name)}** ${res.emoji?res.emoji:'-'} with augment emoji ${res.augEmoji}`
                        ).setFooter(
                            `Requested by ${author.tag}`,
                            author.displayAvatarURL({dynamic: true})
                        ).setColor('RANDOM')
                        .setTimestamp()
    channel.send(embed).catch(console.error)
}

module.exports = {
    name: 'add-augment',
    aliases: ['add-aug', 'addaug', 'addaugment'],
    desc: 'Add augment core to an existing valkyrie',
    expectedArgs: '<valkyrie> <augment emoji>',
    parameters:
        `\`<valkyrie>\`: The name or acronym of the valkyrie to whom to add the augment\n\`<augment emoji>\`: Emoji for the augment\n**Note**: To specify valkyrie name with multiple words, enclose it within quotes`,
    ownerOnly: true,
    category: 'Honkai Impact 3',
    /**
     * 
     * @param {Message} message 
     * @param {[String]} args 
     */
    run: (message, args) => {
        if(!args[0]){
            return message.reply('Please provide a valkyrie name!').catch(console.error)
        }
        if(!args[1]){
            return message.reply('Please provide the augment emoji!').catch(console.error)
        }
        addAug(message, args[0].toLowerCase(), args[1])
    }
}