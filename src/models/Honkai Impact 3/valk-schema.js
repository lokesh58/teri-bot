const {Schema, model} = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const valkSchema = new Schema({
    characterId: reqString,
    name: reqString,
    natureId: reqString,
    baseRank: reqString,
    acronyms: {
        type: [String],
        required: true
    },
    emoji: String
})

const name = 'valk-battlesuits'

module.exports = model[name] || model(name, valkSchema)