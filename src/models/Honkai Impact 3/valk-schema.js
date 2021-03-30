const {Schema, model} = require('mongoose')

const reqObject = {
    type: Object,
    required: true
}

const valkSchema = new Schema({
    character: reqObject,
    name: {
        type: String,
        required: true
    },
    nature: reqObject,
    acronyms: {
        type: [String],
        required: true
    },
    emoji: String
})

const name = 'valk-battlesuits'

module.exports = model[name] || model(name, valkSchema)