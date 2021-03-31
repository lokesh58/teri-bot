const {Message, MessageEmbed, Collection} = require('discord.js')
const {valkBattlesuits, valkNature, valkChars, userValks} = require('$collections')
const userValkSchema = require('$models/Honkai Impact 3/user-valk-schema')
const capitalize = require('$utils/string-capitalize')

/**
 * 
 * @param {Message} message 
 */
const dispValks = async (message) => {
    const {author, channel} = message
    if(!userValks.has(author.id)){
        const res = await userValkSchema.find({
            userId: author.id
        }).catch(console.error)
        if(!res) return message.reply('Some error occured. Please try again!').catch(console.error)
        userValks.set(author.id, new Collection())
        const uv = userValks.get(author.id)
        for(const uvalk of res){
            uv.set(uvalk.valkId, uvalk.rank)
        }
    }
    const uv = userValks.get(author.id)
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
        const rank = uv.get(userValk)
        if(!rank) return message.reply('Some error occured. Please try again!').catch(console.error)
        mapped[valk.characterId] +=
            `${capitalize(valk.name)} ${valk.emoji?valk.emoji:'-'} ${nature.emoji} **${rank.toUpperCase()}**`
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
                        .setTitle(`Valkyries of ${author.tag}`)
                        .setColor('RANDOM')
                        .addFields(fields)
                        .setFooter(
                            `Requested by ${author.tag}`,
                            author.displayAvatarURL({dynamic: true})
                        ).setTimestamp()
    channel.send(embed)
}

const validRanks = [
    'b', 'a', 's', 'ss', 'sss'
]

const rankValues = {
    'b': 1, 'a': 2, 's': 3, 'ss': 4, 'sss': 5
}

/**
 * 
 * @param {Message} message 
 * @param {Array} valks each element is an object with property valk, rank (valk is name or acronym of valkyrja)
 */
const addValks = async (message, valks) => {
    const {author, channel} = message
    const status = []
    for(const rawValk of valks) {
        if(!rawValk.rank || !rawValk.valk){
            status.push(`❌Valkyrja name and rank must be separated by space!`)
            continue
        }
        if(!validRanks.includes(rawValk.rank)){
            status.push(`❌${rawValk.rank.toUpperCase()} is not a valid rank!`)
            continue
        }
        const valk = valkBattlesuits.find(v => v.name === rawValk.valk || v.acronyms.includes(rawValk.valk))
        if(!valk){
            status.push(`❌${capitalize(rawValk.valk)} is not a valid valkyrja battlesuit!`)
            continue
        }
        if(rankValues[rawValk.rank] < rankValues[valk.baseRank]){
            status.push(`❌${capitalize(valk.name)} ${valk.emoji?valk.emoji:''} must have atleast rank \`${valk.baseRank.toUpperCase()}\`!`)
            continue
        }
        const res = await userValkSchema.findOneAndUpdate({
            userId: author.id,
            valkId: valk._id.toString()
        },{
            userId: author.id,
            valkId: valk._id.toString(),
            rank: rawValk.rank
        },{
            upsert: true,
            new: true
        }).catch(console.error)
        if(!res){
            status.push(`❌An error occurred while adding ${capitalize(valk.name)} ${valk.emoji?valk.emoji:''}`)
            continue
        }
        if(userValks.has(res.userId)){
            userValks.get(res.userId).set(res.valkId, res.rank)
        }
        status.push(`✅**${capitalize(valk.name)}** ${valk.emoji?valk.emoji:''} **${res.rank.toUpperCase()}**`)
    }
    const embed = new MessageEmbed()
                        .setTitle(`Registered Valkyries for ${author.tag}`)
                        .setDescription(status.join('\n'))
                        .setColor('RANDOM')
                        .setFooter(
                            `Requested by ${author.tag}`,
                            author.displayAvatarURL({dynamic: true})
                        ).setTimestamp()
    channel.send(embed).catch(console.error)
}

module.exports = {
    name: 'my-valks',
    aliases: ['mv', 'myvalks', 'myvalk', 'my-valk'],
    desc: 'View, add or update your list of battlesuits',
    expectedArgs: '(<valkyrja> <rank>) (,...)',
    parameters:
        `\`(<valkyrja> <rank>)\`: optional parameter to add a new valkyrja to your list of battlesuits or update the rank if already present.
        Replace <valkyrja> with the name or acronym of the battlesuit, and <rank> with the battlesuit rank
        \`(,...)\`: More valkyrja can be added/updated by specifying them after a comma`,
    category: 'Honkai Impact 3',
    /**
     * 
     * @param {Message} message 
     * @param {[String]} args 
     */
    run: (message, args) => {
        if(args.length === 0){
            dispValks(message)
        } else {
            const rawValks = args.join(' ').toLowerCase().split(/\s*,\s*/)
            const valks = []
            for(const rawValk of rawValks) {
                const parts = rawValk.split(/\s+/)
                const rank = parts.pop()
                const valk = parts.join(' ')
                valks.push({
                    valk: valk,
                    rank: rank
                })
            }
            addValks(message, valks)
        }
    }
}