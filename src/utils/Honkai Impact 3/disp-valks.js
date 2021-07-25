const {Message, User, MessageEmbed, Collection} = require('discord.js')
const {valkNature, valkChars, valkBattlesuits, userValks} = require('$collections')
const userValkSchema = require('$models/Honkai Impact 3/user-valk-schema')
const capitalize = require('$utils/string-capitalize')

/**
 * 
 * @param {Message} message 
 * @param {User} target 
 * @returns 
 */
module.exports = async (message, target) => {
    const {author, channel} = message
    if(!userValks.has(target.id)){
        const res = await userValkSchema.find({
            userId: target.id
        }).catch(console.error)
        if(!res) return message.reply('Some error occured. Please try again!').catch(console.error)
        userValks.set(target.id, new Collection())
        const uv = userValks.get(target.id)
        for(const uvalk of res){
            uv.set(uvalk.valkId, uvalk)
        }
    }
    const uv = userValks.get(target.id)
    if(!uv) return message.reply('Some error occured. Please try again!').catch(console.error)
    const mapped = {}
    for(const userValk of uv.keys()){
        const valk = valkBattlesuits.get(userValk)
        if(!valk) return message.reply('Some error occured. Please try again!').catch(console.error)
        if(!mapped[valk.characterId]){
            mapped[valk.characterId] = ''
        }
        if(mapped[valk.characterId].length > 0) mapped[valk.characterId] += '\n'
        const nature = valkNature.get(valk.natureId)
        if(!nature) return message.reply('Some error occured. Please try again!').catch(console.error)
        const ranks = uv.get(userValk)
        if(!ranks.rank) return message.reply('Some error occured. Please try again!').catch(console.error)
        let data = `${capitalize(valk.name)} ${valk.emoji?valk.emoji:'-'} ${nature.emoji} **${ranks.rank.toUpperCase()}**`
        if(ranks.coreRank) data += ` ${valk.augEmoji} **${ranks.coreRank}⭐**`
        mapped[valk.characterId] += data
    }
    const fields = []
    for(const char of valkChars.values()){
        if(mapped[char._id.toString()]){
            fields.push({
                name: capitalize(char.name),
                value: mapped[char._id.toString()],
                inline: true
            })
        }
    }
    if(fields.length === 0){
        fields.push({
            name: 'No valkyries added',
            value: 'Valkyries you register will appear here'
        })
    }
    const embed = new MessageEmbed()
                        .setTitle(`Valkyries of ${target.tag}`)
                        .setColor('RANDOM')
                        .addFields(fields)
                        .setFooter(
                            `Requested by ${author.tag}`,
                            author.displayAvatarURL({dynamic: true})
                        ).setTimestamp()
    channel.send({embeds: [embed]})
}