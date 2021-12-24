const {Message, MessageEmbed} = require('discord.js')

/**
 * Returns the code block
 * @param {String} text 
 * @returns The code
 */
const extractCodeBlock = (text) => {
  const matched = text.match(/```js\n(.*?)```/)
  return matched?.length ? matched[0] : null;
}

module.exports = {
    name: 'eval',
    desc: 'Evaluates js code',
    ownerOnly: true,
    category: 'utility',
    /**
     * 
     * @param {Message} message 
     * @param {[String]} args 
     */
    run: (message, args) => {
      if (!args[0].startsWith('js\n')) return message.reply('Only js is supported')
      const code = args[0].substring(3)
      const oldLog = console.log
      let sandboxConsole = ''
      console.log = (...args) => {
        if (sandboxConsole) sandboxConsole += '\n'
        sandboxConsole += args.map(args => `${args}`).join(' ')
      }
      const result = eval(code)
      console.log = oldLog
      message.reply({
        embeds: [
          new MessageEmbed()
            .setTitle('Eval Result')
            .setDescription(
              `**Input**\n\`\`\`js\n${code}\n\`\`\`\n**Output**\n\`\`\`\n${result}\n\`\`\`\n**Console**\n\`\`\`js\n${sandboxConsole || '<empty>'}\n\`\`\``
            )
            .setTimestamp()
            .setFooter(
              `Requested by ${message.author.tag}`,
              message.author.displayAvatarURL({dynamic: true})
            )
        ]
      })
    }
}