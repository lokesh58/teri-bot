const {Message, MessageEmbed} = require('discord.js')
const getBlacklist = require('$utils/getBlacklist')
const schema = require('$models/blacklist-schema')
const {blacklist} = require('$collections')

/**
 * 
 * @param {String} guildId 
 * @param {[String]} blist 
 * @returns status of adding
 */
const updateBlacklist = async (guildId, blist) => {
    const res = await schema.findByIdAndUpdate(guildId, {
        blacklist: blist
    }, {
        new: true
    }).catch(console.error)
    if(!res) return false
    blacklist.set(guildId, res.blacklist)
}

/**
 * 
 * @param {Message} message 
 * @param {[String]} words 
 */
const addWords = async (message, words) => {
    const {guild, channel, author} = message
    const blist = await getBlacklist(guild.id)
    const toAdd = []
    for(const word of words){
        if(blist.includes(word) || toAdd.includes(word)) continue
        toAdd.push(word)
    }
    if(!updateBlacklist(guild.id, blist.concat(toAdd))){
        return message.reply('Some error occurred. Please try again!').catch(console.error)
    }
    const embed = new MessageEmbed()
                        .setTitle(`Blacklisted Words Added for ${guild.name}`)
                        .setThumbnail(guild.iconURL({dynamic: true}))
                        .setDescription(
                            toAdd.length === 0 ?
                                'No new blacklist words were added!' :
                                `\`${toAdd.join('\`, \`')}\``
                        ).setColor('RANDOM')
                        .setFooter(
                            `Requested by ${author.tag}`,
                            author.displayAvatarURL({dynamic: true})
                        ).setTimestamp()
    channel.send(embed).catch(console.error)
}

/**
 * 
 * @param {Message} message 
 * @param {[String]} words 
 */
const delWords = async (message, words) => {
    const {guild, channel, author} = message
    const blist = await getBlacklist(guild.id)
    const toDel = []
    for(const word of words){
        if(blist.includes(word) && !toDel.includes(word)){
            toDel.push(word)
        }
    }
    if(!updateBlacklist(guild.id, blist.filter(w => !toDel.includes(w)))){
        return message.reply('Some error occurred. Please try again!').catch(console.error)
    }
    const embed = new MessageEmbed()
                        .setTitle(`Blacklisted Words Removed for ${guild.name}`)
                        .setThumbnail(guild.iconURL({dynamic: true}))
                        .setDescription(
                            toDel.length === 0 ?
                                'No blacklisted words were removed!' :
                                `\`${toDel.join('\`, \`')}\``
                        ).setColor('RANDOM')
                        .setFooter(
                            `Requested by ${author.tag}`,
                            author.displayAvatarURL({dynamic: true})
                        ).setTimestamp()
    channel.send(embed).catch(console.error)
}

/**
 * 
 * @param {Message} message 
 */
const viewList = async (message) => {
    const {guild, author, channel} = message
    const blist = await getBlacklist(guild.id)
    if(!blist){
        return message.reply('Some error occured. Please try again!').catch(console.error)
    }
    const embed = new MessageEmbed()
                        .setTitle(`Blacklisted Words for ${guild.name}`)
                        .setDescription(
                            blist.length === 0 ?
                                'No blacklisted words have been added yet!' :
                                `\`${blist.join('\`, \`')}\``
                        ).setThumbnail(guild.iconURL({dynamic: true}))
                        .setColor('RANDOM')
                        .setFooter(
                            `Requested by ${author.tag}`,
                            author.displayAvatarURL({dynamic: true})
                        ).setTimestamp()
    channel.send(embed).catch(console.error)
}

module.exports = {
    name: 'blacklist',
    desc: 'Add/delete/view blacklisted words for the server. Messages with blacklisted words will automatically be deleted!',
    expectedArgs: '<query> [<options>]',
    parameters: '\`<query>\`: The query should be one of \`add\`, \`delete\`, \`view\`. By default the query will be taken as \`view\`.\n\`[<options>]\`: The options for the particular query.\n•__add__: Space separated list of words to add to blacklist. Words are NOT case-sensitive and repeated words will only be added once.\n•__delete__: Space separated list of words to be removed from blacklist. Words not present will not be removed.\n•__view__: No options needed!\n\n**Note**: To add phrases as blacklisted, write them enclosed within double quotes',
    requiredPermissions: ['MANAGE_GUILD'],
    category: 'setting',
    /**
     * 
     * @param {Message} message 
     * @param {[String]} args 
     */
    run: (message, args) => {
        const query = args.shift()?.toLowerCase()
        if(query === 'add'){
            addWords(message, args.map(v => v.toLowerCase()))
        }else if(query === 'delete'){
            delWords(message, args.map(v => v.toLowerCase()))
        }else if(query === 'view' || !query){
            viewList(message)
        }else{
            message.reply('Invalid query!').catch(console.error)
        }
    }
}