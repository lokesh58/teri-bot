const {Schema, model} = require('mongoose')

const reqObject = {
    type: Object,
    required: true
}

const reqString = {
    type: String,
    required: true
}

const valkSchema = new Schema({
    character: reqObject,
    name: reqString,
    nature: reqObject,
    baseRank: reqString,
    acronyms: {
        type: [String],
        required: true
    },
    emoji: String
})

const name = 'valk-battlesuits'

module.exports = model[name] || model(name, valkSchema)