const {Message, MessageEmbed} = require('discord.js')
const {userValks, valkBattlesuits} = require('$collections')
const userValkSchema = require('$models/Honkai Impact 3/user-valk-schema')
const capitalize = require('$utils/string-capitalize')

module.exports = {
    name: 'my-valks-remove',
    aliases: ['myvalksremove', 'mvrm'],
    desc: 'Remove any registered valkyrie battlesuits',
    expectedArgs: '<valkyrie> (,...)',
    parameters:
        `\`<valkyrie>\`: Name or acronym of the valkyrie battlesuit to remove\n\`(,...)\`: More valkyrie battlesuits can be specified separated by comma\n**Example**: To remove WC and CI, use \`mvrm WC, CI\``,
    category: 'Honkai Impact 3',
    /**
     * 
     * @param {Message} message 
     * @param {[String]} args 
     */
    run: async (message, args) => {
        if(!args[0]){
            return message.reply('Please specify atleast one valkyrie battlesuit to remove!').catch(console.error)
        }
        const rawValks = args.join(' ').toLowerCase().split(/\s*,\s*/)
        const status = []
        const {author, channel} = message
        for(const rawValk of rawValks){
            const valk = valkBattlesuits.find(v => v.name === rawValk || v.acronyms.includes(rawValk))
            if(!valk){
                status.push(`❌\`${rawValk}\` is not a valid valkyrie battlesuit!`)
                continue
            }
            const res = await userValkSchema.findOneAndDelete({
                userId: author.id,
                valkId: valk._id.toString()
            }).catch(console.error)
            if(!res){
                status.push(`❌**${capitalize(valk.name)}** ${valk.emoji?valk.emoji:'-'} wasn't registered!`)
                continue
            }
            if(userValks.has(author.id)){
                userValks.get(author.id).delete(valk._id.toString())
            }
            status.push(`**${capitalize(valk.name)}** ${valk.emoji?valk.emoji:'-'}`)
        }
        const embed = new MessageEmbed()
                            .setTitle(`Valkyries Removed for ${author.tag}`)
                            .setDescription(status.join('\n'))
                            .setColor('RANDOM')
                            .setFooter(
                                `Requested by ${author.tag}`,
                                author.displayAvatarURL({dynamic: true})
                            ).setTimestamp()
        channel.send(embed).catch(console.error)
    }
}