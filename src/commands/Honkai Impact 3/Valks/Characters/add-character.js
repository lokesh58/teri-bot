const {Message, MessageEmbed} = require('discord.js')
const {valkChars} = require('$collections')
const charSchema = require('$models/Honkai Impact 3/character-schema')

/**
 * 
 * @param {String} name 
 * @returns exit code {0: success, 1: error encountered, 2: name already in database}
 */
const addChar = async (name) => {
    //Check if name alreaady in database
    let result = valkChars.find(charName => charName === name)
    if (!result) {
        result = await charSchema.find({
            name: name
        }).catch(console.error)
        if (!result) {
            return 1
        }
        if (result.length > 0) {
            for (const char of result) {
                valkChars.set(char._id, char.name)
            }
            return 2
        }
    } else {
        return 2
    }
    //Add new character to database
    result = await new charSchema({
        name: name
    }).save().catch(console.error)
    if (!result) {
        return 1
    }
    valkChars.set(result._id, result.name)
    return 0
}

module.exports = {
    name: 'add-character',
    aliases: ['addcharacter', 'add_character', 'add-char', 'addchar', 'add_char'],
    desc: 'Add a new valkyrja character to database',
    expectedArgs: '<character name> (...)',
    parameters:
        `\`<character name>\`: The name of the character
        \`(...)\`: Optional, more character names can be added, separated by space
        **Note**: To specify names with multiple words, enclose them in quotes eg: \"Raiden Mei\" \"Fu Hua\"`,
    ownerOnly: true,
    category: 'Honkai Impact 3',
    /**
     * 
     * @param {Message} message 
     * @param {[String]} args 
     */
    run: async (message, args) => {
        if(!args[0]) {
            message.reply('Please specify atleast one character name!').catch(console.error)
            return
        }
        const success = []
        const duplicate = []
        const error = []
        for (const name of args) {
            const res = await addChar(name.toLowerCase())
            switch(res){
                case 0:
                    success.push(`\`${name}\``)
                    break
                case 1:
                    error.push(`\`${name}\``)
                    break
                case 2:
                    duplicate.push(`\`${name}\``)
                    break
            }
        }
        const {author, channel} = message
        const embed = new MessageEmbed()
                            .setTitle('Add Characters')
                            .setColor('RANDOM')
                            .setFooter(
                                `Requested by ${author.tag}`,
                                author.displayAvatarURL({dynamic: true})
                            ).setTimestamp()
        if (success.length > 0) {
            embed.addField('Successfully Added', success.join(', '))
        }
        if (duplicate.length > 0) {
            embed.addField('Not added as already present', duplicate.join(', '))
        }
        if (error.length > 0) {
            embed.addField('Not added due to some error', error.join(', '))
        }
        channel.send(embed).catch(console.error)
    }
}