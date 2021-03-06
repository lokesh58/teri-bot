const {Message, MessageEmbed} = require('discord.js')
const {valkChars} = require('$collections')
const capitalize = require('$utils/string-capitalize')

module.exports = {
    name: 'characters',
    aliases: ['chars', 'char', 'character'],
    desc: 'Gives the list of valkryie characters in database',
    category: 'Honkai Impact 3',
    /**
     * 
     * @param {Message} message 
     * @param {[String]} args 
     */
    run: (message, args) => {
        const chars = Array.from(valkChars.values())
        let list = ''
        if (chars.length === 0) {
            list = 'No character has been added yet'
        } else {
            for(let i=0; i<chars.length; ++i) {
                if(i>0) list += '\n'
                list += `\`${i+1}\` ${capitalize(chars[i].name)}`
            }
        }
        const {author, channel} = message
        const embed = new MessageEmbed()
                            .setTitle('List of Valkyrie Characters')
                            .setDescription(list)
                            .setColor('RANDOM')
                            .setFooter(
                                `Requested by ${author.tag}`,
                                author.displayAvatarURL({dynamic: true})
                            ).setTimestamp()
        channel.send({embeds: [embed]}).catch(console.error)
    }
}