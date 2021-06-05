const {Message, MessageEmbed} = require('discord.js')
const {blacklist} = require('$collections')
const schema = require('$models/blacklist-schema')

/**
 * 
 * @param {String} guildId 
 * @returns {[String]}
 */
const getBlacklist = async (guildId) => {
    let blist = blacklist.get(guildId)
    if(!blist){
        try {
            let res = await schema.findById(guildId)
            if(!res){
                res = await new schema({
                    _id: guildId,
                    blacklist: []
                }).save()
            }
            blist = res.blacklist
            blacklist.set(guildId, blist)
        } catch (err) {
            console.error(err)
            blist = null
        }
    }
    return blist
}

/**
 * 
 * @param {Message} message 
 * @param {[String]} words 
 */
const addWords = async (message, words) => {
    message.reply('Under development!').catch(console.error)
}

/**
 * 
 * @param {Message} message 
 * @param {[String]} words 
 */
const delWords = async (message, words) => {
    message.reply('Under development!').catch(console.error)
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
    parameters: '\`<query>\`: The query should be one of \`add\`, \`delete\`, \`view\`. By default the query will be taken as \`view\`.\n\`[<options>]\`: The options for the particular query.\n•__add__: Space separated list of words to add to blacklist. Wrods are NOT case-sensitive and repeated words will only be added once.\n•__delete__: Space separated list of words to be removed from blacklist. Words not present will not be removed.\n•__view__: No options needed!',
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
        }else{
            viewList(message)
        }
    }
}