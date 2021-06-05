const {Schema, model} = require('mongoose')

const blacklistSchema = new Schema({
    _id: {
        type: String,
        required: true
    }, //guild id
    blacklist: {
        type: [String],
        required: true
    }
})

const name = 'blacklists'

module.exports = model[name] || model(name, blacklistSchema)