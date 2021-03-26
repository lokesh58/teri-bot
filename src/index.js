const {Client} = require('discord.js')
require('dotenv').config()
const cmdLoader = require('./utils/command-loader')
const eventStarter = require('./utils/event-starter')

client = new Client()
client.owners = [
    '651011187076759553',
    '322078119018364938'
]
cmdLoader(client)
eventStarter(client)
client.login(process.env.BOT_TOKEN)