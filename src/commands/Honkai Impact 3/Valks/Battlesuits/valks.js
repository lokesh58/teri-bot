const {Message, MessageEmbed} = require('discord.js')
const {valkNature, valkChars, valkBattlesuits} = require('$collections')
const capitalize = require('$utils/string-capitalize')

module.exports = {
    name: 'valks',
    aliases: ['valk', 'v'],
    desc: 'Gives the list of all valkyries stored in the database',
    category: 'Honkai Impact 3',
    /**
     * 
     * @param {Message} message 
     * @param {String} args 
     */
    run: (message, args) => {
        const mapValk = {}
        for (const valk of valkBattlesuits.values()) {
            if(!mapValk[valk.characterId]){
                mapValk[valk.characterId] = []
            }
            const nature = valkNature.get(valk.natureId)
            if(!nature) return message.reply('Some error occured. Please try again!').catch(console.error)
            mapValk[valk.characterId].push(
                `${capitalize(valk.name)} ${valk.emoji?valk.emoji:'-'} \`${valk.acronyms[0].toUpperCase()}\` ${nature.emoji}`
            )
        }
        const fields = []
        for(const char of valkChars.values()) {
            const valkList = mapValk[char._id.toString()]
            let valkData = ''
            if(!valkList){
                valkData = 'No battlesuits for this valkyrie'
            }else{
                valkData = valkList.join('\n')
            }
            fields.push({
                name: capitalize(char.name),
                value: valkData,
                inline: true
            })
        }
        const {author, channel} = message
        const embed = new MessageEmbed()
                            .setTitle('List of Valkyrie Battlesuits')
                            .addFields(fields)
                            .setColor('RANDOM')
                            .setFooter(
                                `Requested by ${author.tag}`,
                                author.displayAvatarURL({dynamic: true})
                            ).setTimestamp()
        channel.send(embed).catch(console.error)
    }
}