const {Collection} = require('discord.js')

const prefixes = new Collection()
const valkNature = new Collection()
const valkChars = new Collection()
const valkBattlesuits = new Collection()
const userValks = new Collection()

module.exports = {
    prefixes, valkNature, valkChars, valkBattlesuits, userValks
}