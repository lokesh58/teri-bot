const {Message, MessageEmbed} = require('discord.js')
const {inspect: inspectUtil} = require('util')

const inspect = (arg) => typeof arg === 'string' ? arg : inspectUtil(arg);

module.exports = {
    name: 'execute',
    aliases: ['exec', 'run'],
    desc: 'Runs js code.',
    expectedArgs: '<js code block>',
    parameters: '`<js code block>`: The javascript code block to execute',
    ownerOnly: true,
    category: 'utility',
    /**
     * 
     * @param {Message} message 
     * @param {[String]} args 
     */
    run: async (message, args) => {
      if (!args[0]) return message.reply('Please supply a js codeblock!')
      if (!args[0].startsWith('js\n')) return message.reply('Only js codeblock is supported!')
      const code = args[0].substring(3)
      const oldLog = console.log
      let sandboxConsole = ''
      let error = ''
      console.log = (...args) => {
        if (sandboxConsole) sandboxConsole += '\n'
        sandboxConsole += args.map(arg => inspect(arg)).join(' ')
      }
      try {
        await eval(`(async()=>{${code}})()`)
      } catch (err) {
        error = `${err}`
      }
      const maxAllowedLength = 3000
      if (sandboxConsole.length > maxAllowedLength) sandboxConsole = sandboxConsole.substring(0, maxAllowedLength) + '...'
      if (error.length > maxAllowedLength) error = error.substring(0, maxAllowedLength) + '...'
      console.log = oldLog
      let out = `**Input**\n\`\`\`js\n${code}\n\`\`\``
      if (sandboxConsole) out += `\n**Output**\n\`\`\`js\n${sandboxConsole}\n\`\`\``
      if (error) out += `\n**Error**\n\`\`\`\n${error}\n\`\`\``
      else if (!sandboxConsole) out += `\n✅ Execution successful, no output on console`
      message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle('Execution Result')
            .setDescription(out)
            .setTimestamp()
            .setColor('RANDOM')
            .setFooter(
              `Requested by ${message.author.tag}`,
              message.author.displayAvatarURL({dynamic: true})
            )
        ]
      }).catch(console.error)
    }
}
