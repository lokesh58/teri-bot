const {Message, MessageEmbed} = require('discord.js')
const {valkNature} = require('$collections')
const capitalize = require('$utils/string-capitalize')

module.exports = {
    name: 'natures',
    desc: 'Gives the list of all valkyrie natures stored in the database',
    category: 'Honkai Impact 3',
    /**
     * 
     * @param {Message} message 
     * @param {[String]} args 
     */
    run: (message, args) => {
        let list = ''
        for (const nature of valkNature.values()) {
            if (list.length > 0) list += '\n'
            list += `• \`${capitalize(nature.name)}\` ${nature.emoji}`
        }
        if(list.length === 0){
            list = 'No valkyrie nature has been added yet!'
        }
        const {author, channel} = message
        const embed = new MessageEmbed()
                            .setTitle('List of Valkyrie Natures')
                            .setDescription(list)
                            .setColor('RANDOM')
                            .setFooter(
                                `Requested by ${author.tag}`,
                                author.displayAvatarURL({dynamic: true})
                            ).setTimestamp()
        channel.send(embed).catch(console.error)
    }
}