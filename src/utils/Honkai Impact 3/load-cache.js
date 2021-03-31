const {valkBattlesuits, valkChars, valkNature} = require('$collections')
const charSchema = require('$models/Honkai Impact 3/character-schema')
const valkSchema = require('$models/Honkai Impact 3/valk-schema')
const natureSchema = require('$models/Honkai Impact 3/nature-schema')

const maxTries = 5

const load = async (coll, schema) => {
    let tries = 0
    let res = null
    while (!res && tries < maxTries) {
        res = await schema.find({}).catch(console.error)
        tries += 1
    }
    if(!res) return false
    //Delete all entries corrently in the collection
    const keys = Array.from(coll.keys())
    for(const key of keys){
        coll.delete(key)
    }
    //Add the updated entries
    for(const i of res){
        coll.set(i._id.toString(), i)
    }
    return true
}

module.exports = () => {
    if(!load(valkNature, natureSchema)) return false
    if(!load(valkChars, charSchema)) return false
    if(!load(valkBattlesuits, valkSchema)) return false
    return true
}