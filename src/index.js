require('module-alias/register')
require('dotenv').config()
const {Client, Intents} = require('discord.js')
const cmdLoader = require('$utils/command-loader')
const eventStarter = require('$utils/event-starter')
const { DiscordTogether } = require('discord-together')

const client = new Client({
    partials: [
        'CHANNEL', 'MESSAGE', 'GUILD_MEMBER', 'REACTION'
    ],
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
    allowedMentions: {
        parse: ['users', 'roles', 'everyone'],
        repliedUser: true
    }
})
client.owners = [
    '651011187076759553',
    '322078119018364938',
    '385170368530219009'
]
client.discordTogether = new DiscordTogether(client)
cmdLoader(client)
eventStarter(client)
client.login(process.env.BOT_TOKEN)