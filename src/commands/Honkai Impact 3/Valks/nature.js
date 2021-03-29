const {Message, MessageEmbed} = require('discord.js')
const natureSchema = require('$models/Honkai Impact 3/nature-schema')
const capitalize = require('$utils/string-capitalize')

module.exports = {
    name: 'nature',
    desc: 'Gives the list of all valkyrja natures stored in the database',
    category: 'Honkai Impact 3',
    /**
     * 
     * @param {Message} message 
     * @param {[String]} args 
     */
    run: async (message, args) => {
        const natures = await natureSchema.find({}).catch(console.error)
        if (!natures) {
            message.reply('Some error occured. Please try again.').catch(console.error)
            return
        }
        let list = ''
        if(natures.length === 0) {
            list = 'No valkyrja nature has been added yet'
        } else {
            for (const nature of natures) {
                if (list.length > 0) list += '\n'
                list += `• \`${capitalize(nature.name)}\` ${nature.emoji}`
            }
        }
        const {author, channel} = message
        const embed = new MessageEmbed()
                            .setTitle('List of Valkyrja Natures')
                            .setDescription(list)
                            .setColor('RANDOM')
                            .setFooter(
                                `Requested by ${author.tag}`,
                                author.displayAvatarURL({dynamic: true})
                            ).setTimestamp()
        channel.send(embed).catch(console.error)
    }
}