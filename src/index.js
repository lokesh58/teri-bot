const {Client} = require('discord.js')
require('dotenv').config()
const cmdLoader = require('./utils/command-loader')
const eventStarter = require('./utils/event-starter')

client = new Client()
cmdLoader(client)
eventStarter(client)
client.login(process.env.BOT_TOKEN)