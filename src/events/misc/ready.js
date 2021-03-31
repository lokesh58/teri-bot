const mongoose = require('mongoose')
const loadHi3cache = require('$utils/Honkai Impact 3/load-cache')

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
        console.log(`${client.user.username} is online!`)
    })
}