const {Message, MessageEmbed} = require('discord.js')
const {valkBattlesuits, userValks} = require('$collections')
const userValkSchema = require('$models/Honkai Impact 3/user-valk-schema')
const capitalize = require('$utils/string-capitalize')
const dispValks = require('$utils/Honkai Impact 3/disp-valks')

const validRanks = [
    'b', 'a', 's', 's1', 's2', 's3', 'ss', 'ss1', 'ss2', 'ss3', 'sss'
]

const validCores = [
    '1', '2', '3', '4', '5', '6'
]

const coreRequirement = {
    'a': ['a', 's', 's', 'ss', 'ss', 'sss'],
    's': ['s', 's', 's', 's', 'ss', 'sss']
}

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
        const isValidRank = validRanks.includes(rawValk.rank)
        const isValidCore = validCores.includes(rawValk.rank)
        if(!isValidRank && !isValidCore){
            status.push(`❌${rawValk.rank.toUpperCase()} is not a valid rank!`)
            continue
        }
        const valk = valkBattlesuits.find(v => v.name === rawValk.valk || v.acronyms.includes(rawValk.valk))
        if(!valk){
            status.push(`❌${capitalize(rawValk.valk)} is not a valid valkyrie battlesuit! Did you forget to add commas between different valkyries?`)
            continue
        }
        if(isValidRank && validRanks.indexOf(rawValk.rank) < validRanks.indexOf(valk.baseRank)){
            status.push(`❌${capitalize(valk.name)} ${valk.emoji?valk.emoji:'-'} must have atleast rank \`${valk.baseRank.toUpperCase()}\`!`)
            continue
        }
        if(isValidCore){
            if(!valk.augEmoji){
                status.push(`❌${capitalize(valk.name)} ${valk.emoji?valk.emoji:'-'} does not have an augment!`)
                continue
            }
            //Check if user already has the valk
            let res = null
            if(!userValks.has(author.id)){
                res = await userValkSchema.findOne({
                    userId: author.id,
                    valkId: valk._id.toString()
                }).catch(console.error)
            }else{
                res = userValks.get(author.id).get(valk._id.toString())
            }
            if(!res){
                status.push(`❌You don't own ${capitalize(valk.name)} ${valk.emoji?valk.emoji:'-'}!`)
                continue
            }
            const reqRank = coreRequirement[valk.baseRank][+rawValk.rank-1]
            if(validRanks.indexOf(res.rank) < validRanks.indexOf(reqRank)){
                status.push(`❌${capitalize(valk.name)} ${valk.emoji?valk.emoji:'-'} must have atleast rank \`${reqRank.toUpperCase()}\`!`)
                continue
            }
        }
        const query = {
            userId: author.id,
            valkId: valk._id.toString()
        }
        if(isValidRank){
            query.rank = rawValk.rank
        }else{
            query.coreRank = rawValk.rank
        }
        const res = await userValkSchema.findOneAndUpdate({
            userId: author.id,
            valkId: valk._id.toString()
        }, query, {
            upsert: true,
            new: true
        }).catch(console.error)
        if(!res){
            status.push(`❌An error occurred while adding ${capitalize(valk.name)} ${valk.emoji?valk.emoji:''}`)
            continue
        }
        if(userValks.has(res.userId)){
            userValks.get(res.userId).set(res.valkId, res)
        }
        let rankStat = rawValk.rank.toUpperCase()
        if(isValidCore){
            rankStat += '⭐'
        }
        status.push(`**${capitalize(valk.name)}** ${valk.emoji?valk.emoji:'-'} **${rankStat}**`)
    }
    const totalPages = Math.ceil(status.length/30);
    let currentPage = 1;
    let print = status.splice(0,30)
    let embed = new MessageEmbed()
                        .setTitle(`Registered Valkyries for ${author.tag}`)
                        .setDescription(print.join('\n'))
                        .setColor('RANDOM')
                        .setFooter(`(${currentPage}/${totalPages})`)
    while(status.length > 0){
        await channel.send({embeds: [embed]}).catch(console.error)
        currentPage += 1
        print = status.splice(0, 30)
        embed = new MessageEmbed()
                        .setDescription(print.join('\n'))
                        .setColor('RANDOM')
                        .setFooter(`(${currentPage}/${totalPages})`)
    }
    embed.setFooter(
        `(${currentPage}/${totalPages}) • Requested by ${author.tag}`,
        author.displayAvatarURL({dynamic: true})
    ).setTimestamp()
    await channel.send({embeds: [embed]}).catch(console.error)
}

module.exports = {
    name: 'my-valks',
    aliases: ['mv', 'myvalks', 'myvalk', 'my-valk'],
    desc: 'View, add or update your list of valkyrie battlesuits',
    expectedArgs: '(<valkyrie> <rank>) (,...)',
    parameters:
        `\`(<valkyrie> <rank>)\`: optional, add new valkyrie battlesuit or update the rank of already existing one\n**\`<valkyrie>\`**: name or acronym of the valkyrie battlesuit\n**\`<rank>\`**: rank of the valkyrie battlesuit\n\`(,...)\`: More valkyries can be added/updated by specifying them after a comma\n\n**Example Usage**:\n\`mv\` will show a list of all your registered valkyries\n\`mv WC B, CI A\` will register *WC* at rank *B* and *CI* at rank *A*\n\`mv DK 5\` will register *DK* at augment core level 5⭐`,
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