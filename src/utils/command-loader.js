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
                console.log(cmd)
            }
        }
    }

    load('../commands')
}