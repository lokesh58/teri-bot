const {Message} = require('discord.js')
const dispValks = require('$utils/Honkai Impact 3/disp-valks')

module.exports = {
    name:'user-valks',
    aliases: ['user-valk', 'uservalks', 'uservalk', 'uvalks', 'uvalk', 'uv'],
    desc: 'Gives a list of all valkyries of a user',
    expectedArgs: '<@user>',
    parameters:
        ``,
    category: 'Honkai Impact 3',
    /**
     * 
     * @param {Message} message 
     * @param {[String]} args 
     */
    run: (message, args) => {
        if(!args[0]){
            return message.reply('Please mention the user!').catch(console.error)
        }
        let target = message.mentions.users.first()
        if(!target){
            const u = args.join(' ').toLowerCase()
            target = message.client.users.resolve(u)
            if(!target){
                target = message.client.users.cache.find(
                    user => user.username.toLowerCase() === u
                            || user.tag.toLowerCase() === u
                )
            }
        }
        if(!target){
            return message.reply('The user was not found. Try mentioning them or using their discord user ID').catch(console.error)
        }
        dispValks(message, target)
    }
}