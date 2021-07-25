const { CommandInteraction } = require('discord.js')

module.exports = {
    name: 'youtube',
    description: 'watch youtube in voice channel',
    options: [
        {
            name: 'channel',
            description: 'channel where you want to watch youtube',
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
        interaction.client.discordTogether.createTogetherCode(channelID, 'youtube').then((x)=>{
            interaction.followUp(x.code)
        })
    }
}