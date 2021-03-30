const {Message, MessageEmbed} = require('discord.js')
const {valkNature} = require('$collections')
const charSchema = require('$models/Honkai Impact 3/character-schema')
const natureSchema = require('$models/Honkai Impact 3/nature-schema')
const valkSchema = require('$models/Honkai Impact 3/valk-schema')
const capitalize = require('$utils/string-capitalize')

const getNature = async (id) => {
    let res = valkNature.get(id)
    if(!res){
        res = await natureSchema.findById(id).catch(console.error)
        if (res) {
            valkNature.set(res._id, {
                name: res.name,
                emoji: res.emoji
            })
        }
    }
    return res
}

module.exports = {
    name: 'valks',
    desc: 'Gives the list of all registered valkyrja battlesuits in database',
    category: 'Honkai Impact 3',
    /**
     * 
     * @param {Message} message 
     * @param {String} args 
     */
    run: async (message, args) => {
        const chars = await charSchema.find({}).catch(console.error)
        const allvalks = await valkSchema.find({}).catch(console.error)
        if(!chars || !allvalks) return message.reply('Some error occured. Please try again!').catch(console.error)
        const mapValk = {}
        for (const valk of allvalks) {
            if(!mapValk[valk.character]){
                mapValk[valk.character] = []
            }
            mapValk[valk.character].push(valk)
        }
        const fields = []
        for(const char of chars) {
            const valks = mapValk[char._id]
            let valkData = ''
            if(valks.length === 0){
                valkData = 'No battlesuit for this character'
            }else{
                for(const valk of valks){
                    if(valkData.length > 0) valkData += '\n'
                    const nature = await getNature(valk.nature)
                    if(!nature) return message.reply('Some error occured. Please try again!').catch(console.error)
                    valkData += 
                        `${capitalize(valk.name)} ${valk.emoji?valk.emoji:'-'} \`${valk.acronyms[0]}\` ${nature.emoji}`
                }
            }
            fields.push({
                name: capitalize(char.name),
                value: valkData,
                inline: true
            })
        }
        const {author, channel} = message
        const embed = new MessageEmbed()
                            .setTitle('List of Valkyrja Battlesuits')
                            .addFields(fields)
                            .setColor('RANDOM')
                            .setFooter(
                                `Requested by ${author.tag}`,
                                author.displayAvatarURL({dynamic: true})
                            ).setTimestamp()
        channel.send(embed).catch(console.error)
    }
}