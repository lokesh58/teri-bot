const {blacklist} = require('$collections')
const schema = require('$models/blacklist-schema')

/**
 * 
 * @param {String} guildId 
 * @returns {[String]}
 */
module.exports = async (guildId) => {
    let blist = blacklist.get(guildId)
    if(!blist){
        try {
            let res = await schema.findById(guildId)
            if(!res){
                res = await new schema({
                    _id: guildId,
                    blacklist: []
                }).save()
            }
            blist = res.blacklist
            blacklist.set(guildId, blist)
        } catch (err) {
            console.error(err)
            blist = null
        }
    }
    return blist
}