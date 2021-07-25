const {readdirSync, lstatSync} = require('fs')
const {join} = require('path')

module.exports = (client) => {
    const start = (dir) => {
        const files = readdirSync(join(__dirname, dir))
        for (const file of files) {
            const stat = lstatSync(join(__dirname, dir, file))
            if (stat.isDirectory()) {
                start(join(dir, file))
            } else if (file.endsWith('.js')) {
                const event = require(join(__dirname, dir, file))
                event(client)
                console.log(`Started event ${file}`)
            }
        }
    }

    start('../events')
}