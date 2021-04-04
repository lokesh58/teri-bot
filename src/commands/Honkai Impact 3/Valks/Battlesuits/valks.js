const {Message, MessageEmbed, Util} = require('discord.js')
const {valkNature, valkChars, valkBattlesuits} = require('$collections')
const capitalize = require('$utils/string-capitalize')

/**
 * 
 * @param {Message} message 
 * @returns 
 */
const dispAllValks = (message) => {
    const mapValk = {}
    for (const valk of valkBattlesuits.values()) {
        if(!mapValk[valk.characterId]){
            mapValk[valk.characterId] = []
        }
        const nature = valkNature.get(valk.natureId)
        if(!nature) return message.reply('Some error occured. Please try again!').catch(console.error)
        let data = `${capitalize(valk.name)} ${valk.emoji?valk.emoji:'-'} \`${valk.acronyms[0].toUpperCase()}\` ${nature.emoji}`
        if(valk.augEmoji){
            data += ` ${valk.augEmoji}`
        }
        mapValk[valk.characterId].push(data)
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

/**
 * 
 * @param {Message} message 
 * @param {String} name 
 */
const dispValk = (message, name) => {
    const valk = valkBattlesuits.find(v => v.name === name || v.acronyms.includes(name))
    if(!valk){
        return message.reply(`Valkyrie \`${name}\` was not found!`).catch(console.error)
    }
    const char = valkChars.get(valk.characterId)
    if(!char){
        return message.reply('Some error occured. Please try again!').catch(console.error)
    }
    const nature = valkNature.get(valk.natureId)
    if(!nature){
        return message.reply('Some error occured. Please try again!').catch(console.error)
    }
    const {author, channel} = message
    const embed = new MessageEmbed()
                        .setTitle('Valkyrie Information')
                        .addField('Valkyrie Character Name', capitalize(char.name))
                        .addField('Valkyrie Battlesuit Name', capitalize(valk.name))
                        .addField('Valkyrie Battlesuit Nature', `${capitalize(nature.name)} ${nature.emoji}`)
                        .addField('Base Rank', valk.baseRank.toUpperCase())
                        .addField('Acronyms', `\`${valk.acronyms.join('\`, \`').toUpperCase()}\``)
                        .setColor('RANDOM')
                        .setFooter(
                            `Requested by ${author.id}`,
                            author.displayAvatarURL({dynamic: true})
                        ).setTimestamp()
    if(valk.augEmoji){
        embed.addField('Augment Core Emoji', valk.augEmoji)
    }
    if(valk.emoji){
        const emote = Util.parseEmoji(valk.emoji)
        const ext = emote.animated ? 'gif' : 'png'
        const url = `https://cdn.discordapp.com/emojis/${emote.id}.${ext}?v=1`
        embed.setThumbnail(url)
    }
    channel.send(embed).catch(console.error)
}

module.exports = {
    name: 'valks',
    aliases: ['valk', 'v'],
    desc: 'Gives the list of all valkyries stored in the database',
    expectedArgs: '(<valkyrie>)',
    parameters: `\`(<valkyrie>)\`: Optional, the name or acronym of a valkyrie. Specify to get information regarding a particular valkyrie`,
    category: 'Honkai Impact 3',
    /**
     * 
     * @param {Message} message 
     * @param {[String]} args 
     */
    run: (message, args) => {
        if(!args[0]){
            dispAllValks(message)
        }else{
            dispValk(message, args.join().toLowerCase())
        }
    }
}