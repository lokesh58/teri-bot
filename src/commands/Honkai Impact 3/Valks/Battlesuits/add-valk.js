const {Message, MessageEmbed} = require('discord.js')
const {valkBattlesuits, valkChars, valkNature} = require('$collections')
const valkSchema = require('$models/Honkai Impact 3/valk-schema')
const natureSchema = require('$models/Honkai Impact 3/nature-schema')
const charSchema = require('$models/Honkai Impact 3/character-schema')
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
    let res = valkChars.findKey(charName => charName === name)
    if (!res) { //Search the database
        res = await charSchema.findOne({
            name: name
        }).catch(console.error)
        if (!res) return message.reply('The character does not exist in database!').catch(console.error)
        valkChars.set(res._id, res.name)
        res = res._id
    }
    valkObj.character = res

    //Check if nature is valid ------------------------------------------------------------------------
    res = valkNature.findKey(nat => nat.name === nature || nat.emoji === nature)
    if (!res) { //Search the database
        res = await natureSchema.findOne({
            $or: [
                {name: nature},
                {emoji: nature}
            ]
        }).catch(console.error)
        if (!res) return message.reply('The nature does not exist in database!').catch(console.error)
        valkNature.set(res._id,{
            name: res.name,
            emoji: res.emoji
        })
        res = res._id
    }
    valkObj.nature = res

    //Check if the name or acronyms are not already present---------------------------------------------
    res = valkBattlesuits.find(valk => valk.name === battlesuit || valk.acronyms.some(e => acronyms.includes(e))
                                || (valk.emoji && emoji && valk.emoji === emoji))
    if (!res) { //Check if present in database
        const query = [
            {name: battlesuit},
            {acronyms: {$in: acronyms}}
        ]
        if (emoji) {
            query.push({emoji: emoji})
        }
        res = await valkSchema.find({
            $or: query
        }).catch(console.error)
        if (!res) return message.reply('Some error occured. Please try again!').catch(console.error)
        if (res.length > 0) {
            for (const valk of res) {
                valkBattlesuits.set(valk._id, {
                    character: valk.character,
                    name: valk.name,
                    nature: valk.nature,
                    acronyms: valk.acronyms,
                    emoji: valk.emoji
                })
            }
        }
        res = res[0]
    }
    if (res) return message.reply('The battlesuit name or emoji or acronym already exists in database!').catch(console.error)
    valkObj.name = battlesuit
    valkObj.acronyms = acronyms
    valkObj.baseRank = rank
    if (emoji) valkObj.emoji = emoji

    //Add to database
    res = await new valkSchema(valkObj).save().catch(console.error)
    if (!res) return message.reply('Some error occured. Please try again!').catch(console.error)
    valkBattlesuits.set(res._id, {
        character: res.character,
        name: res.name,
        nature: res.nature,
        acronyms: res.acronyms,
        emoji: res.emoji
    })

    const {author, channel} = message
    const embed = new MessageEmbed()
                        .setTitle('Add Valkyrja Battlesuit Successful')
                        .setDescription('Battlesuit with following details has been added')
                        .addField('Character Name', capitalize(valkChars.get(res.character)))
                        .addField('Battlesuit Name', capitalize(res.name))
                        .addField(
                            'Nature',
                            `${capitalize(valkNature.get(res.nature).name)} ${valkNature.get(res.nature).emoji}`
                        ).addField('Base Rank', res.baseRank)
                        .addField('Acronyms', res.acronyms.join(', '))
                        .setColor('00FF00')
                        .setFooter(
                            `Requested by ${author.tag}`,
                            author.displayAvatarURL({dynamic: true})
                        ).setTimestamp()
    if (res.emoji) {
        embed.setThumbnail(res.emoji)
    }
    channel.send(embed).catch(console.error)
}

const validBaseRanks = [
    'B', 'A', 'S'
]

module.exports = {
    name: 'add-valk',
    aliases: ['addvalk', 'add_valk'],
    desc: 'Add a new valkyrja battlesuit to the database',
    expectedArgs: '<valkyrja name> <battlesuit name> <battlesuit nature> <base rank> <acronyms> (<emoji>)',
    parameters:
        `\`<valkyrja name>\`: Name of the character
        \`<battlesuit name>\`: Name of the battlesuit
        \`<battlesuit nature>\`: Nature of the battlesuit (name or emoji)
        \`<base rank>\`: Base rank of the battlesuit (B, A or S)
        \`<acronyms>\`: Acronyms for the battlesuit, if specifying more than one, enclose all within quotes and separate by space
        \`(emoji)\`: Optional, emoji for the battlesuit
        **Note**: To specify names with multiple words, enclose them in quotes eg: \"Kiana Kaslana\", \"White Comet\"`,
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
        rank = rank.toUpperCase()
        
        acronyms = acronyms.toUpperCase().split(/\s+/)
        if (emoji) {
            emoji = emoji.match(/<a?:.+?:\d+>/)
            if (emoji) {
                emoji = emoji[0]
                const emojiID = emoji.match(/\d+/).pop()
                if (!message.client.emojis.cache.get(emojiID)) {
                    message.reply('I don\'t have access to that emoji. No emoji will be set.')
                    emoji = null
                }
            }
        }
        addValk(message, name.toLowerCase(), battlesuit.toLowerCase(), nature.toLowerCase(), rank, acronyms, emoji)
    }
}