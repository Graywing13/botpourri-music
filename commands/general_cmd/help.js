/* ==================================================== help.js ========================================================

Target: Send help messages (both overview and command-specific) when requested 
Current Functionality: nonfunctional 
Priority: medium

Tasks: 
[0] Clean up, read current code
[1] Send specific help message 
[2] Spend specific help message 

Notes: 
- 
    
===================================================================================================================== */
"use strict";

const { prefix } = require('../../config.json');

module.exports = { 
  name: 'help',
  alias: 'h',
  description: 'Send help messages when requested.',
  args: 0, 
  usage: "<commandName?>",
  // PURPOSE: construct and send the correct help message. 
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
      // msg.channel.send(`${msg.author} - ${optionalInfo}Correct usage for ${command.name} is: \n\`\`\`${prefix}${commandName} ${command.usage}\`\`\`\n${command.description}`);
      msg.channel.send("This feature is under development.")
    } catch (e) {
      console.log("In sendCommandUsageInfo: " + e);
    }
  }, 
  // PURPOSE: send a message pinging the user telling them how to use the command. 
  notifyWrongUsage: function notifyWrongUsage(msg) {
    msg.reply(`Please type b.help for more information.`);
  }
}

// PURPOSE: send a message about the specific commandName that describes how to use the command. 
function sendSpecificHelpMessage(commandName) {
  
}

// PURPOSE: send a message pinging the user telling them how to use the command. 
function sendGeneralHelpMessage() {
  
}