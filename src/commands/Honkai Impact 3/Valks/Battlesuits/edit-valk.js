const {Message, MessageEmbed} = require('discord.js')
const {valkBattlesuits, valkChars, valkNature, validBaseRanks} = require('$collections')
const valkSchema = require('$models/Honkai Impact 3/valk-schema.js')
const capitalize = require('$utils/string-capitalize')

const checkCharName = (name) => {
    name = name.toLowerCase()
    return valkChars.find(c => c.name === name)?._id.toString()
}

const checkValkName = (name) => {
    return name.toLowerCase()
}

const checkNature = (name) => {
    return valkNature.find(n => n.name === name.toLowerCase() || n.emoji === name)?._id.toString()
}

const checkBaseRank = (rank) => {
    rank = rank.toLowerCase()
    if(validBaseRanks.includes(rank)){
        return false;
    }
    return rank
}

const checkEmoji = (emoji) => {
    emoji = emoji.match(/<a?:.+?:\d+>/)
    if (emoji) {
        emoji = emoji[0]
    }
    return emoji
}

const attribChecks = {
    'charname': checkCharName,
    'valkname': checkValkName,
    'nature': checkNature,
    'baserank': checkBaseRank,
    'emoji': checkEmoji,
    'augemoji': checkEmoji
}

const changeAttrib = {
    'charname': 'characterId',
    'valkname': 'name',
    'nature': 'natureId',
    'baserank': 'baseRank',
    'emoji': 'emoji',
    'augemoji': 'augEmoji'
}

module.exports = {
    name: 'edit-valk',
    aliases: ['editvalk', 'edit_valk'],
    desc: 'Edit an existing valkyrie battlesuit in the database',
    expectedArgs: '<valkyrie name/acronym> <attribute> <new value> (,...)',
    parameters:
        `\`<valkyrie name/acronym>\`: Name or acronym of the valkyrie battlesuit to edit\n\`<attribute>\`: The attribute of the valkyrie which needs to be changed. Valid attributes are *${Object.keys(attribChecks).join('*, *')}*\n\`<new value>\`: New value for the attribute\n\`(,...)\`: More *attribute, new value* pairs can be specified separated by comma\n**Note**: If name is more than one words enclose within quotes. e.g: \"White Comet\"`,
    ownerOnly: true,
    category: 'Honkai Impact 3',
    /**
     * 
     * @param {Message} message 
     * @param {[String]} args 
     */
    run: async (message, args) => {
        if(!args[0]){
            return message.reply('Please specify the valkyrie to edit!').catch(console.error)
        }
        const tvalk = args.shift().toLowerCase()
        const valk = valkBattlesuits.find(v => v.name === tvalk || v.acronyms.includes(tvalk))
        if(!valk){
            return message.reply(`\`${tvalk}\` is not a valid valkyrie!`).catch(console.error)
        }
        const changes = args.join(' ').split(/\s*,\s*/)
        const upd = new Object()
        const status = []
        let success = 0
        for(const change of changes){
            const parts = change.split(/\s+/)
            const attrib = parts.shift().toLowerCase()
            const val = parts.join(' ')
            if(!attrib) continue
            if(!val) {
                status.push(`❌No value specified for \`${attrib}\``)
                continue
            }
            const checker = attribChecks[attrib]
            if(!checker){
                status.push(`❌\`${attrib}\` is not a valid attribute`)
                continue
            }
            const newVal = checker(val)
            if(!newVal){
                status.push(`❌Invalid value \`${val}\` for \`${attrib}\``)
                continue
            }
            //Proper Attribute and Value
            upd[changeAttrib[attrib]] = newVal
            status.push(`**${attrib}** changed to **${val}**`)
            success += 1
        }
        if(success > 0){
            const res = await valkSchema.findByIdAndUpdate(valk._id, upd, {new: true}).catch(console.error)
            if(!res){
                return message.reply('Some error occurred. Please try again!').catch(console.error)
            }
            valkBattlesuits.set(res._id.toString(), res)
        }
        const {channel, author} = message
        const embed = new MessageEmbed()
                            .setTitle(`Changes for valkyrie ${capitalize(valk.name)}`)
                            .setDescription(status.join('\n'))
                            .setColor('RANDOM')
                            .setFooter(
                                author.tag,
                                author.displayAvatarURL({dynamic: true})
                            ).setTimestamp()
        channel.send(embed).catch(console.error)
    }
}