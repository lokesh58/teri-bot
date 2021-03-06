const {readdirSync, lstatSync} = require('fs')
const {join} = require('path')
const {Collection} = require('discord.js')

module.exports = (client) => {
    client.commands = new Collection()
    client.aliases = new Collection()
    client.slashCommands = new Collection()

    const load = (dir, cmdCollection) => {
        const files = readdirSync(join(__dirname, dir))
        for (const file of files) {
            const stat = lstatSync(join(__dirname, dir, file))
            if (stat.isDirectory()) {
                load(join(dir, file), cmdCollection)
            } else if(file.endsWith('.js')) {
                const cmd = require(join(__dirname, dir, file))
                if (!cmd.name) {
                    console.log(`${file} does not have a name specified`)
                } else {
                    cmdCollection.set(cmd.name, cmd)
                    console.log(`Loaded command ${cmd.name}`)
                    if (cmd.aliases && Array.isArray(cmd.aliases)) {
                        for (const alias of cmd.aliases) {
                            client.aliases.set(alias, cmd.name)
                        }
                        console.log(`Registered aliases for ${cmd.name}`)
                    }
                }
            }
        }
    }

    load('../commands', client.commands)
    load('../slashCommands', client.slashCommands)
}