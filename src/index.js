const {Client} = require('discord.js')
require('dotenv').config()

client = new Client()

client.on('ready', () => {
    console.log(`${client.user.username} is ready`)
})

client.on('message', (message) => {
    if(message.content === 't!ping'){
        message.channel.send('pong!');
    }
})

client.login(process.env.BOT_TOKEN)