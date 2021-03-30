const {Message, MessageEmbed} = require('discord.js')
const {valkBattlesuits, valkNature} = require('$collections')
const valkSchema = require('$models/Honkai Impact 3/valk-schema')
const userValkSchema = require('$models/Honkai Impact 3/user-valk-schema')
const charSchema = require('$models/Honkai Impact 3/character-schema')
const natureSchema = require('$models/Honkai Impact 3/nature-schema')
const capitalize = require('$utils/string-capitalize')

const validRanks = [
    'B', 'A', 'S', 'SS', 'SSS'
]

const rankValues = {
    'B': 1,
    'A': 2,
    'S': 3,
    'SS': 4,
    'SSS': 5
}

const getValk = async (valk) => {
    const name = valk.toLowerCase()
    const acronym = valk.toUpperCase()
    let res = valkBattlesuits.find(v => v.name === name || v.acronyms.includes(acronym))
    if(!res){
        res = await valkSchema.find({
            $or: [
                {name: name},
                {acronyms: acronym}
            ]
        }).catch(console.error)
        if(res){
            if(res.length === 0)
                res = null
            else {
                res = res[0]
                valkBattlesuits.set(res._id, res)
            }
        }
    }
    return res
}

const getValkById = async (id) => {
    let res = valkBattlesuits.get(id)
    if(!res) {
        res = await valkSchema.findById(id).catch(console.error)
        if(res){
            valkBattlesuits.set(res._id, res)
        }
    }
    return res
}

const getNatureById = async (id) => {
    let res = valkNature.get(id)
    if(!res) {
        res = await natureSchema.findById(id).catch(console.error)
        if(res){
            valkNature.set(res._id, res)
        }
    }
    return res
}

/**
 * 
 * @param {Message} message 
 */
const dispValks = async (message) => {
    const {author, channel} = message
    const userValks = await userValkSchema.find({
        user: author.id
    }).catch(console.error)
    const chars = await charSchema.find({}).catch(console.error)
    if(!userValks || !chars) return message.reply('Some error occured. Please try again!').catch(console.error)
    const mapped = {}
    for(const userValk of userValks){
        const valk = await getValkById(userValk.valk)
        if(!valk) return message.reply('Some error occured. Please try again!').catch(console.error)
        if(!mapped[valk.character]){
            mapped[valk.character] = ''
        }
        if(mapped[valk.character].length > 0) mapped[valk.character] += '\n'
        const nature = await getNatureById(valk.nature)
        if(!nature) return message.reply('Some error occured. Please try again!').catch(console.error)
        mapped[valk.character] +=
            `${capitalize(valk.name)} ${valk.emoji?valk.emoji:'-'} ${nature.emoji} **${userValk.rank}**`
    }
    const fields = []
    for(const char of chars){
        if(mapped[char._id]){
            fields.push({
                name: capitalize(char.name),
                value: mapped[char._id],
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
            status.push(`❌${rawValk.rank} is not a valid rank!`)
            continue
        }
        const valk = await getValk(rawValk.valk)
        if(!valk){
            status.push(`❌${rawValk.valk} is not a valid valkyrja battlesuit!`)
            continue
        }
        if(rankValues[rawValk.rank] < rankValues[valk.baseRank]){
            status.push(`❌${capitalize(valk.name)} ${valk.emoji?valk.emoji:''} must have atleast rank \`${valk.baseRank}\`!`)
            continue
        }
        const res = await userValkSchema.findOneAndUpdate({
            user: author.id,
            valk: valk._id
        },{
            user: author.id,
            valk: valk._id,
            rank: rawValk.rank
        },{
            upsert: true,
            new: true
        }).catch(console.error)
        if(!res){
            status.push(`❌An error occurred while adding ${capitalize(valk.name)} ${valk.emoji?valk.emoji:''}`)
        }
        status.push(`✅**${capitalize(valk.name)}** ${valk.emoji?valk.emoji:''} **${res.rank}**`)
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
            const rawValks = args.join(' ').split(/\s*,\s*/)
            const valks = []
            for(const rawValk of rawValks) {
                const parts = rawValk.split(/\s+/)
                const rank = parts.pop().toUpperCase()
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