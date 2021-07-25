const { CommandInteraction } = require('discord.js')

module.exports = {
    name: 'test',
    description: 'this is a testing command',
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {[String]} args 
     */
    run: async(interaction, args) => {
        interaction.editReply({content: "Hello World"})
    }
}