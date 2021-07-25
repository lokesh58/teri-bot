const mongoose = require('mongoose')
const loadHi3cache = require('$utils/Honkai Impact 3/load-cache')
const {Client} = require('discord.js')

/**
 * 
 * @param {Client} client 
 */
module.exports = (client) => {
    client.on('ready', async () => {
        await mongoose.connect(process.env.MONGODB_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useFindAndModify: false
        }).then(() => {
            console.log('Connected to mongodb!')
            if(!loadHi3cache()){
                console.error('Failed loading HI3 cache')
            }else{
                console.log('Successfully loaded HI3 cache')
            }
        }).catch(console.error)
        await client.guilds.cache.get('787501525228453888').commands.set(Array.from(client.slashCommands.values()))
        console.log(`${client.user.username} is online!`)
    })
}