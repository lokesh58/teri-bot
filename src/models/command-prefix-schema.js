const {Schema, model} = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const commandPrefixSchema = new Schema({
    _id: reqString, //guild id
    prefix: reqString
})

const name = 'command-prefixes'

module.exports = model[name] || model(name, commandPrefixSchema)