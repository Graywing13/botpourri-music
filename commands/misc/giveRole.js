const getUserFromMention = require('../../tools/parseMention.js').getUserFromMention;
module.exports = { 
  name: 'giverole',
  description: 'b.giverole <user>',
  args: 2,
  usage: "<user> <role>",
  execute(msg, args) {
    // TODO parseMention, try catch
    console.log(typeof getUserFromMention);
    const user = getUserFromMention(msg, args[0]);
    return msg.channel.send(`${user.username} | ${args[1]} ${user.displayAvatarURL({format: "png", size: 256, dynamic: true})}`);
  }
}