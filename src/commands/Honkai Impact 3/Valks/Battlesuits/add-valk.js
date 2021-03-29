const {Message} = require('discord.js')

module.exports = {
    name: 'add-valk',
    aliases: ['addvalk', 'add_valk'],
    desc: 'Add a new valkyrja battlesuit to the database',
    expectedArgs: '<valkyrja name> <battlesuit name> <battlesuit nature> <acronyms> (<emoji>)',
    parameters:
        `\`<valkyrja name>\`: Name of the character
        \`<battlesuit name>\`: Name of the battlesuit
        \`<battlesuit nature>\`: Nature of the battlesuit (name or emoji)
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
            message.reply('Please specify atleast one acronym!').catch(console.error)
            return
        }
        let [name, battlesuit, nature, acronyms, emoji] = args
        acronyms = acronyms.split(/\s+/)
        console.log(`${name}, ${battlesuit}, ${nature}, ${acronyms.join('/')}, ${emoji}`)
        message.reply('Under development').catch(console.error)
    }
}