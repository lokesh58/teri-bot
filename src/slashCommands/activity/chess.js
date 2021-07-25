const { CommandInteraction } = require('discord.js')

module.exports = {
    name: 'chess',
    description: 'play chess in voice channel',
    options: [
        {
            name: 'channel',
            description: 'channel where you want to play chess',
            type: 'CHANNEL',
            required: true
        }
    ],
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {[String]} args 
     */
    run: async(interaction, args) => {
        const [channelID] = args
        const channel = interaction.guild.channels.cache.get(channelID)
        if (channel?.type !== 'GUILD_VOICE'){
            return interaction.followUp({content: 'Please choose a voice channel'})
        }
        interaction.client.discordTogether.createTogetherCode(channelID, 'chess').then((x)=>{
            interaction.followUp(x.code)
        })
    }
}