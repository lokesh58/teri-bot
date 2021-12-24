const {Message, MessageEmbed} = require('discord.js')

module.exports = {
    name: 'eval',
    desc: 'Evaluates js code. (Note: empty console won\'t be displayed',
    expectedArgs: '<js code block>',
    parameters: '`<js code block>`: The javascript code block to evaluate',
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
        sandboxConsole += args.map(args => `${args}`).join(' ')
      }
      let result;
      try {
        result = await eval(code)
      } catch (err) {
        error = `${err}`
      }
      const maxAllowedLength = 1500
      if (result && result.length > maxAllowedLength) result = result.substring(0, maxAllowedLength) + '...'
      if (sandboxConsole.length > maxAllowedLength) sandboxConsole = sandboxConsole.substring(0, maxAllowedLength) + '...'
      if (error.length > maxAllowedLength) error = error.substring(0, maxAllowedLength) + '...'
      console.log = oldLog
      let out = `**Input**\n\`\`\`js\n${code}\n\`\`\``
      if (!error) out += `\n**Output**\n\`\`\`js\n${result}\n\`\`\``
      if (sandboxConsole) out += `\n**Console**\n\`\`\`\n${sandboxConsole}\n\`\`\``
      if (error) out += `\n**Error**\n\`\`\`\n${error}\n\`\`\``
      message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle('Eval Result')
            .setDescription(out)
            .setTimestamp()
            .setFooter(
              `Requested by ${message.author.tag}`,
              message.author.displayAvatarURL({dynamic: true})
            )
        ]
      }).catch(console.error)
    }
}