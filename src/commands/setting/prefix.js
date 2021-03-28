const {Message, MessageEmbed} = require('discord.js')
const getPrefix = require('../../utils/getPrefix')
const {prefixes} = require('../../collections')
const cmdPrefixSchema = require('../../models/command-prefix-schema')

/**
 * 
 * @param {Message} message 
 */
const displayPrefix = async (message) => {
    const {guild, author, channel} = message
    const prefix = await getPrefix(guild.id)
    if (!prefix) {
        console.error('Inside prefix command without having a prefix')
        message.reply('There was an error retrieiving the prefix. Please try again.').catch(console.error)
    } else {
        const embed = new MessageEmbed()
                            .setTitle(guild.name)
                            .setDescription(`Prefix: \`${prefix}\``)
                            .setFooter(
                                `Requested by ${author.tag}`,
                                author.displayAvatarURL({dynamic: true})
                            ).setTimestamp()
        channel.send(embed).catch(console.error)
    }
}

/**
 * 
 * @param {Message} message 
 * @param {String} newPrefix 
 */
const changePrefix = async (message, newPrefix) => {
    const {guild, channel, author} = message
    const result = await cmdPrefixSchema.findByIdAndUpdate(guild.id, {
        prefix: newPrefix
    }) //Result contains the old data
    if(!result) {
        message.reply('There was an error changing the prefix. Please try again.').catch(console.error)
    } else {
        prefixes.set(guild.id, newPrefix)
        const embed = new MessageEmbed()
                            .setTitle(`Prefix change for \`${guild.name}\``)
                            .setDescription(
                                `**Old Prefix:** \`${result.prefix}\`
                                **New Prefix:** \`${newPrefix}\``
                            ).setFooter(
                                `Requested by ${author.tag}`,
                                author.displayAvatarURL({dynamic: true})
                            ).setTimestamp()
        channel.send(embed).catch(console.error)
    }
}

module.exports = {
    name: 'prefix',
    desc: 'Used for viewing or changing the prefix of this bot for your server',
    expectedArgs: '(<new prefix>)',
    parameters: '\`(<new prefix>)\`: Optional, replace with the new prefix you want',
    requiredPermissions: ['MANAGE_GUILD'],
    category: 'setting',
    /**
     * 
     * @param {Message} message 
     * @param {[String]} args 
     */
    run: (message, args) => {
        if(args.length === 0) {
            displayPrefix(message)
        } else {
            changePrefix(message, args[0].toLowerCase())
        }
    }
}