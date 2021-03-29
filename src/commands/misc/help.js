const {Message, MessageEmbed} = require('discord.js')
const checkPermission = require('../../utils/checkPermission')
const getPrefix = require('../../utils/getPrefix')
const capitalize = require('../../utils/string-capitalize')
/**
 * 
 * @param {Message} message 
 */
const listCommands = async (message) => {
    const {client, member, guild, author, channel} = message
    // Make a dictionary with key as category, and value as list of all commands with that category
    const commands = {}
    const noCategory = 'Everything Else'
    for (const cmd of client.commands.values()) {
        if (!checkPermission(member, cmd))
            continue
        const category = cmd.category ? cmd.category : noCategory
        if(!commands[category]){
            commands[category] = []
        }
        commands[category].push(`\`${cmd.name}\``)
    }
    const prefix = await getPrefix(guild.id)
    if (!prefix) {
        prefix = process.env.DEFAULT_PREFIX
        console.error('Executing help command without prefix in collection')
    }
    const embed = new MessageEmbed()
                    .setTitle('Available Commands')
                    .setDescription(
                        `📫 Here are a list of all commands you can use.
                        To get help relating to a specific command use \`${prefix}help <command name>\``
                    ).setTimestamp()
                    .setFooter(
                        `Requested by ${author.tag}`,
                        author.displayAvatarURL({dynamic: true})
                    ).setColor('RANDOM')
    //Add all commands in fields
    for (const category in commands) {
        embed.addField(capitalize(category), commands[category].join(', '))
    }
    //Send the embed in channel
    channel.send(embed).catch(console.error)
}

/**
 * 
 * @param {Message} message 
 * @param {String} cmdName 
 */
const commandHelp = async (message, cmdName) => {
    const {client, channel, guild, author} = message
    const cmd = client.commands.get(cmdName) || client.commands.get(client.aliases.get(cmdName))
    const prefix = await getPrefix(guild.id)
    if (!prefix) {
        prefix = process.env.DEFAULT_PREFIX
        console.error('Executing help command without prefix in collection')
    }
    if (!cmd) {
        const embed = new MessageEmbed()
                            .setTitle(`Command \`${cmdName}\` not found`)
                            .setDescription(`Please use \`${prefix}help\` to get list of all commands`)
                            .setColor('FF0000')
        message.reply(embed).catch(console.error)
    } else {
        const embed = new MessageEmbed()
                            .setTitle(`Command Help for \`${cmd.name}\``)
                            .setDescription(
                                cmd.expectedArgs
                                    ? `\`${prefix}${cmd.name} ${cmd.expectedArgs}\``
                                    : `\`${prefix}${cmd.name}\``

                            ).setColor('RANDOM')
                            .setFooter(
                                `Requested by ${author.tag}`,
                                author.displayAvatarURL({dynamic: true})
                            ).setTimestamp()
        if (cmd.aliases && Array.isArray(cmd.aliases)) {
            embed.addField('Aliases', `\`${cmd.aliases.join('\`, \`')}\``)
        }
        if (cmd.requiredPermissions && Array.isArray(cmd.requiredPermissions)) {
            embed.addField('Required Permissions', `\`${cmd.requiredPermissions.join('\`, \`')}\``)
        }
        if (cmd.desc) {
            embed.addField('Description', cmd.desc)
        }
        if (cmd.parameters) {
            embed.addField('Parameters', cmd.parameters)
        }
        channel.send(embed).catch(console.error)
    }
}

module.exports = {
    name: 'help',
    aliases: ['h'],
    desc: 'Gives the list of commands or help regarding a specific command',
    expectedArgs: '(<command name>)',
    parameters: `\`(<command name>)\`: Optional, replace with an available command`,
    category: 'misc',
    /**
     * 
     * @param {Message} message 
     * @param {[String]} args 
     */
    run: (message, args) => {
        if (args.length === 0) {
            listCommands(message)
        } else {
            commandHelp(message, args[0].toLowerCase())
        }
    }
}