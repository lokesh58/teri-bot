const {Message, MessageEmbed} = require('discord.js')
const {valkBattlesuits, valkNature, valkChars, userValks} = require('$collections')
const userValkSchema = require('$models/Honkai Impact 3/user-valk-schema')
const capitalize = require('$utils/string-capitalize')
const dispValks = require('$utils/Honkai Impact 3/disp-valks')

const validRanks = [
    'b', 'a', 's', 's1', 's2', 'ss', 'ss1', 'ss2', 'ss3', 'sss'
]

/**
 * 
 * @param {Message} message 
 * @param {Array} valks each element is an object with property valk, rank (valk is name or acronym of valkyrie)
 */
const addValks = async (message, valks) => {
    const {author, channel} = message
    const status = []
    for(const rawValk of valks) {
        if(!rawValk.rank || !rawValk.valk){
            status.push(`❌Valkyrie name and rank must be separated by space!`)
            continue
        }
        if(!validRanks.includes(rawValk.rank)){
            status.push(`❌${rawValk.rank.toUpperCase()} is not a valid rank!`)
            continue
        }
        const valk = valkBattlesuits.find(v => v.name === rawValk.valk || v.acronyms.includes(rawValk.valk))
        if(!valk){
            status.push(`❌${capitalize(rawValk.valk)} is not a valid valkyrie battlesuit!`)
            continue
        }
        if(validRanks.indexOf(rawValk.rank) < validRanks.indexOf(valk.baseRank)){
            status.push(`❌${capitalize(valk.name)} ${valk.emoji?valk.emoji:'-'} must have atleast rank \`${valk.baseRank.toUpperCase()}\`!`)
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
        status.push(`**${capitalize(valk.name)}** ${valk.emoji?valk.emoji:'-'} **${res.rank.toUpperCase()}**`)
    }
    let print = status.splice(0,30)
    let embed = new MessageEmbed()
                        .setTitle(`Registered Valkyries for ${author.tag}`)
                        .setDescription(print.join('\n'))
                        .setColor('RANDOM')
    while(status.length > 0){
        channel.send(embed).catch(console.error)
        print = status.splice(0, 30)
        embed = new MessageEmbed()
                        .setDescription(print.join('\n'))
                        .setColor('RANDOM')
    }
    embed.setFooter(
        `Requested by ${author.tag}`,
        author.displayAvatarURL({dynamic: true})
    ).setTimestamp()
    channel.send(embed).catch(console.error)
}

module.exports = {
    name: 'my-valks',
    aliases: ['mv', 'myvalks', 'myvalk', 'my-valk'],
    desc: 'View, add or update your list of valkyrie battlesuits',
    expectedArgs: '(<valkyrie> <rank>) (,...)',
    parameters:
        `\`(<valkyrie> <rank>)\`: optional, add new valkyrie battlesuit or update the rank of already existing one
        **\`<valkyrie>\`**: name or acronym of the valkyrie battlesuit
        **\`<rank>\`**: rank of the valkyrie battlesuit
        \`(,...)\`: More valkyries can be added/updated by specifying them after a comma

        **Example Usage**:
        \`mv\` will show a list of all your registered valkyries
        \`mv WC B, CI A\` will register *WC* at rank *B* and *CI* at rank *A*`,
    category: 'Honkai Impact 3',
    /**
     * 
     * @param {Message} message 
     * @param {[String]} args 
     */
    run: (message, args) => {
        if(args.length === 0){
            dispValks(message, message.author)
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