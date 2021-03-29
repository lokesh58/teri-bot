const {Schema, model} = require('mongoose')

const charSchema = new Schema({
    name: {
        type: String,
        required: true
    }
})

const name = 'valk-characters'

module.exports = model[name] || model(name, charSchema)