const { SystemChannelFlags } = require("discord.js");

module.exports = { 
  name: 'nowplaying',
  alias: 'np',
  description: 'play <song url>',
  args: true,
  usage: "<song url>",
  execute: async function(msg, args) {

    // Join the same voice channel of the author of the message
    if (msg.guild.voice.channel) {
      return msg.channel.send("huehue i am in a voice channel >:3")
    } else {
      return msg.channel.send("im not in a voice channel :3");
    }
  }
}