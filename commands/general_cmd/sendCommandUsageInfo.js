const { prefix } = require('../../config.json');
const { getCommand } = require('../../index');

module.exports = { 
  name: 'help',
  alias: 'h',
  description: 'practice <song tag>',
  args: 0, 
  usage: "<commandName>",
  // PURPOSE: send a message pinging the user telling them they misused the command
  // TODO the help function (this) actually doesnt work lol. 
  execute: function(msg, commandName, optionalInfo = "") {
    console.log("LOG: (help fn) commandName " + commandName);
    console.log("LOG: (help fn) typeof commandName " + typeof commandName);
    if (commandName.length === 0) {
      return msg.channel.send("< Insert general help function here >");
    }
    if (Array.isArray(commandName)) {
      console.log("LOG: (help fn) commandName[0] " + commandName[0]);
      commandName = commandName[0];
    }

    try {
      let command = getCommand(commandName);
      msg.channel.send(`${msg.author} - ${optionalInfo}Correct usage for ${command.name} is: \n\`\`\`${prefix}${commandName} ${command.usage}\`\`\`\n${command.description}`);
    } catch (e) {
      msg.channel.send(e);
    }
  }
}
