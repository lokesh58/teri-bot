const {Schema, model} = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const natureSchema = new Schema({
    name: reqString,
    emoji: reqString
})

const name = 'valk-natures'

module.exports = model[name] || model(name, natureSchema)