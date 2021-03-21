const {readdirSync, lstatSync} = require('fs')
const {join} = require('path')
const {Collection} = require('discord.js')

module.exports = (client) => {
    client.commands = new Collection()

    const load = (dir) => {
        const files = readdirSync(join(__dirname, dir))
        for (const file of files) {
            const stat = lstatSync(join(__dirname, dir, file))
            if (stat.isDirectory()) {
                load(join(dir, file))
            } else if(file.endsWith('.js')) {
                const cmd = require(join(__dirname, dir, file))
                if (!cmd.name) {
                    console.log(`${file} does not have a name specified`)
                } else {
                    client.commands.set(cmd.name, cmd)
                    console.log(`Loaded command ${cmd.name}`)
                    if (cmd.aliases && Array.isArray(cmd.aliases)) {
                        for (const alias of cmd.aliases) {
                            client.commands.set(alias, cmd)
                        }
                        console.log(`Registered aliases for ${cmd.name}`)
                    }
                }
            }
        }
    }

    load('../commands')
}