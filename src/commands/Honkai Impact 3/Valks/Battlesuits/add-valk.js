const {Message, MessageEmbed, Util} = require('discord.js')
const {valkBattlesuits, valkChars, valkNature, validBaseRanks} = require('$collections')
const valkSchema = require('$models/Honkai Impact 3/valk-schema')
const capitalize = require('$utils/string-capitalize')

/**
 * 
 * @param {Message} message 
 * @param {String} name 
 * @param {String} battlesuit 
 * @param {String} nature 
 * @param {String} rank 
 * @param {[String]} acronyms 
 * @param {String} emoji 
 */
const addValk = async (message, name, battlesuit, nature, rank, acronyms, emoji) => {
    const valkObj = new Object()
    //Check if name is valid character name -------------------------------------------------------
    let res = valkChars.find(char => char.name === name)
    if (!res) return message.reply('The character does not exist!').catch(console.error)
    valkObj.characterId = res._id.toString()

    //Check if nature is valid ------------------------------------------------------------------------
    res = valkNature.find(nat => nat.name === nature.toLowerCase() || nat.emoji === nature)
    if (!res) return message.reply('The nature does not exist!').catch(console.error)
    valkObj.natureId = res._id.toString()

    //Check if the name or acronyms are not already present---------------------------------------------
    res = valkBattlesuits.find(valk => valk.name === battlesuit || valk.acronyms.some(e => acronyms.includes(e))
                                || (valk.emoji && emoji && valk.emoji === emoji))
    if (res) return message.reply('The battlesuit name or emoji or acronym already exists in database!').catch(console.error)
    valkObj.name = battlesuit
    valkObj.acronyms = acronyms
    valkObj.baseRank = rank
    if (emoji) valkObj.emoji = emoji

    //Add to database
    res = await new valkSchema(valkObj).save().catch(console.error)
    if (!res) return message.reply('Some error occured. Please try again!').catch(console.error)
    valkBattlesuits.set(res._id.toString(), res)

    const {author, channel} = message
    const embed = new MessageEmbed()
                        .setTitle('Add Valkyrja Battlesuit Successful')
                        .setDescription('Battlesuit with following details has been added')
                        .addField('Character Name', capitalize(valkChars.get(res.characterId).name))
                        .addField('Battlesuit Name', capitalize(res.name))
                        .addField(
                            'Nature',
                            `${capitalize(valkNature.get(res.natureId).name)} ${valkNature.get(res.natureId).emoji}`
                        ).addField('Base Rank', res.baseRank.toUpperCase())
                        .addField('Acronyms', res.acronyms.join(', ').toUpperCase())
                        .setColor('00FF00')
                        .setFooter(
                            `Requested by ${author.tag}`,
                            author.displayAvatarURL({dynamic: true})
                        ).setTimestamp()
    if (res.emoji) {
        const emote = Util.parseEmoji(res.emoji)
        const ext = emote.animated ? 'gif' : 'png'
        const url = `https://cdn.discordapp.com/emojis/${emote.id}.${ext}?v=1`
        embed.setThumbnail(url)
    }
    channel.send({embeds: [embed]}).catch(console.error)
}

module.exports = {
    name: 'add-valk',
    aliases: ['addvalk', 'add_valk'],
    desc: 'Add a new valkyrie battlesuit to the database',
    expectedArgs: '<valkyrie name> <battlesuit name> <battlesuit nature> <base rank> <acronyms> (<emoji>)',
    parameters:
        `\`<valkyrie name>\`: Name of the character\n\`<battlesuit name>\`: Name of the battlesuit\n\`<battlesuit nature>\`: Nature of the battlesuit (name or emoji)\n\`<base rank>\`: Base rank of the battlesuit (B, A or S)\n\`<acronyms>\`: Acronyms for the battlesuit, if specifying more than one, enclose all within quotes and separate by space\n\`(emoji)\`: Optional, emoji for the battlesuit\n**Note**: To specify names with multiple words, enclose them in quotes eg: \"Kiana Kaslana\", \"White Comet\"`,
    ownerOnly: true,
    category: 'Honkai Impact 3',
    /**
     * 
     * @param {Message} message 
     * @param {[String]} args 
     */
    run: (message, args) => {
        if(!args[0]) {
            message.reply('Please specify the character name!').catch(console.error)
            return
        }
        if(!args[1]){
            message.reply('Please specify the battlesuit name').catch(console.error)
            return
        }
        if(!args[2]){
            message.reply('Please specify the battlesuit nature!').catch(console.error)
            return
        }
        if(!args[3]){
            message.reply('Please specify the base rank of the battlesuit!').catch(console.error)
        }
        if(!args[4]){
            message.reply('Please specify atleast one acronym!').catch(console.error)
            return
        }
        let [name, battlesuit, nature, rank, acronyms, emoji] = args
        rank = rank.toLowerCase()
        if(!validBaseRanks.includes(rank)) return message.reply('The Base Rank is not valid!').catch(console.error)
        acronyms = acronyms.toLowerCase().split(/\s+/)
        if (emoji) {
            emoji = emoji.match(/<a?:.+?:\d+>/)
            if (emoji) {
                emoji = emoji[0]
            }
        }
        addValk(message, name.toLowerCase(), battlesuit.toLowerCase(), nature, rank, acronyms, emoji)
    }
}