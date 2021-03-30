const {Message} = require('discord.js')

const validRanks = [
    'B', 'A', 'S', 'SS', 'SSS'
]

const rankValues = {
    'B': 1,
    'A': 2,
    'S': 3,
    'SS': 4,
    'SSS': 5
}

module.exports = {
    name: 'my-valks',
    aliases: ['mv', 'myvalks', 'myvalk', 'my-valk'],
    desc: 'View, add or update your list of battlesuits',
    expectedArgs: '(<valkyrja> <rank>) (,...)',
    parameters:
        `\`(<valkyrja> <rank>)\`: optional parameter to add a new valkyrja to your list of battlesuits or update the rank if already present.
        Replace <valkyrja> with the name or acronym of the battlesuit, and <rank> with the battlesuit rank
        \`(,...)\`: More valkyrja can be added/updated by specifying them after a comma`,
    category: 'Honkai Impact 3',
    /**
     * 
     * @param {Message} message 
     * @param {[String]} args 
     */
    run: (message, args) => {
        if(args.length === 0){
            //TODO: Display list of user's valks
        } else {
            const rawValks = args.join(' ').split(/\s*,\s*/)
            for(const rawValk of rawValks) {
                console.log(rawValk)
                const parts = rawValk.split(/\s+/)
                const rank = parts.pop().toUpperCase()
                const valk = parts.join(' ').toLowerCase()
                //TODO: Add/Update the list of user's valks
            }
        }
    }
}