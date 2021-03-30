const {Schema, model} = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const schema = new Schema({
    user: reqString,
    valk: {
        type: Object, //id of valk in database
        required: true
    },
    rank: reqString
})

const name = 'user-valks'

module.exports = model[name] || model(name, schema)