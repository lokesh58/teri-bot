const {Message} = require('discord.js')
const {parse} = require('shell-quote')

module.exports = {
    name: 'add-valk',
    aliases: ['addvalk', 'add_valk'],
    desc: 'Add a new valkyrja battlesuit to the database',
    expectedArgs: '<valkyrja name> <battlesuit name> <battlesuit nature> <acronym> (...)',
    parameters:
        `\`<valkyrja name>\`: Name of the character, must be registered in database
        \`<battlesuit name>\`: Name of the battlesuit, must be different from any registered battlesuit
        \`<battlesuit nature>\`: Nature of the battlesuit, must be registered in the database
        \`<acronym>\`: Acronym for the battlesuit, must be different from any registered battlesuit
        \`(...)\`: Optional, more acronyms can be specified separated by space
        **Note**: To specify names with multiple words, enclose them in quotes eg: \"Kiana Kaslana\", \"White Comet\"`,
    ownerOnly: true,
    category: 'Honkai Impact 3',
    /**
     * 
     * @param {Message} message 
     * @param {[String]} args 
     */
    run: (message, args) => {
        const parsedArgs = parse(args.join(' '))
        console.log(parsedArgs)
        message.reply('Under development').catch(console.error)
    }
}