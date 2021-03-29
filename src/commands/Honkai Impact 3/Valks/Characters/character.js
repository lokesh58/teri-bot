const {Message, MessageEmbed} = require('discord.js')
const charSchema = require('$models/Honkai Impact 3/character-schema')
const capitalize = require('$utils/string-capitalize')

module.exports = {
    name: 'characters',
    aliases: ['chars'],
    desc: 'Gives the list of valkryja characters in database',
    category: 'Honkai Impact 3',
    /**
     * 
     * @param {Message} message 
     * @param {[String]} args 
     */
    run: async (message, args) => {
        const chars = await charSchema.find({}).catch(console.error)
        if (!chars) {
            message.reply('Some error occcured. Please try again!').catch(console.error)
            return
        }
        let list = ''
        if (chars.length === 0) {
            list = 'No character has been added yet'
        } else {
            for(let i=0; i<chars.length; ++i) {
                if(i>0) list += '\n'
                list += `\`${i+1}\` ${capitalize(chars[i].name)}`
            }
        }
        const {author, channel} = message
        const embed = new MessageEmbed()
                            .setTitle('List of Valkyrja Characters')
                            .setDescription(list)
                            .setColor('RANDOM')
                            .setFooter(
                                `Requested by ${author.tag}`,
                                author.displayAvatarURL({dynamic: true})
                            ).setTimestamp()
        channel.send(embed).catch(console.error)
    }
}