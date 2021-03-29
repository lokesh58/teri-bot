const {Message} = require('discord.js')

module.exports = {
    name: 'add-character',
    aliases: ['addcharacter', 'add_character', 'add-char', 'addchar', 'add_char'],
    desc: 'Add a new valkyrja character to database',
    expectedArgs: '<character name> (...)',
    parameters:
        `\`<character name>\`: The name of the character, must be different from any registered names
        \`(...)\`: Optional, more character names can be added, separated by space
        **Note**: To specify names with multiple words, enclose them in quotes eg: \"Raiden Mei\" \"Fu Hua\"`,
    ownerOnly: true,
    category: 'Honkai Impact 3',
    run: (message, args) => {
        message.reply('Under development').catch(console.error)
    }
}