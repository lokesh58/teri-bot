const {Client} = require('discord.js')

/**
 * 
 * @param {Client} client 
 */
 module.exports = (client) => {
    client.on('interactionCreate', async (interaction) => {
        if (interaction.isCommand()) {
            await interaction.defer().catch(console.error)
            const cmd = client.slashCommands.get(interaction.commandName)
            if(!cmd) return interaction.followUp({ content: 'An error has occured'})
            
            const args = []
            interaction.options.data.map((x) => {
                args.push(x.value);
            })
            console.log(`Running slash command ${cmd.name}`)
            cmd.run(interaction, args)
        }
    })
 }