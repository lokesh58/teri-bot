const {Message, MessageEmbed} = require('discord.js')
const {valkNature} = require('$collections')
const charSchema = require('$models/Honkai Impact 3/character-schema')
const natureSchema = require('$models/Honkai Impact 3/nature-schema')
const valkSchema = require('$models/Honkai Impact 3/valk-schema')
const capitalize = require('$utils/string-capitalize')

const getNature = async (id) => {
    let res = valkNature.get(id)
    if(!res){
        res = await natureSchema.findByID(id).catch(console.error)
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
        if(!chars) return message.reply('Some error occured. Please try again!').catch(console.error)
        const fields = []
        for(const char of chars) {
            const valks = await valkSchema.find({
                character: char._id
            }).catch(console.error)
            if(!valks) return message.reply('Some error occured. Please try again!').catch(console.error)
            let valkData = ''
            if(valks.length === 0){
                valkData = 'No battlesuit for this character'
            }else{
                for(const valk of valks){
                    if(valkData.length > 0) valkData += '\n'
                    valkData += 
                        `${capitalize(valk.name)} ${valk.emoji?valk.emoji:'-'} \`${valk.acronyms[0]}\` ${await getNature(valk.nature)}`
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