const {prefixes} = require('$collections/index')
const cmdPrefixSchema = require('$models/command-prefix-schema')

module.exports = async (guildID) => {
    let prefix = prefixes.get(guildID)
    if (!prefix) {
        let result = await cmdPrefixSchema.findById(guildID).catch(console.error)
        if (!result) {
            // Prefix not in database, store the default one
            result = await new cmdPrefixSchema({
                _id: guildID,
                prefix: process.env.DEFAULT_PREFIX
            }).save().catch(console.error)
            if (!result) {
                // There was some error in writing to databse, abort
                return
            }
        }
        // Now we have the prefix, store in collection
        prefixes.set(guildID, result.prefix)
        prefix = result.prefix
    }
    return prefix
}