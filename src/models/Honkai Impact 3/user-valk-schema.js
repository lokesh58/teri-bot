const {Schema, model} = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const schema = new Schema({
    userId: reqString,
    valkId: reqString,
    rank: reqString,
    coreRank: String
})

const name = 'user-valks'

module.exports = model[name] || model(name, schema)