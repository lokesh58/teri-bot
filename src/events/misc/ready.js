const mongoose = require('mongoose')

module.exports = (client) => {
    client.on('ready', () => {
        mongoose.connect(process.env.MONGODB_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        }).then(
            console.log('Connected to mongodb!')
        ).catch(console.error)
        console.log(`${client.user.username} is online!`)
    })
}