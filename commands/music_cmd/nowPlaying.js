const { SystemChannelFlags } = require("discord.js");

module.exports = { 
  name: 'nowplaying',
  alias: 'np',
  description: 'play <song url>',
  requiresServerQueue: true,
  usage: "",
  execute: async function(msg, requiresServerQueue, args) {
    try {
      msg.channel.send(requiresServerQueue[0]);
    } catch(err) {
      msg.channel.send("Something is wrong with the server queue dechu.")
      console.log(err);
    }

    // Join the same voice channel of the author of the message
    if (msg.guild.voice) {
      msg.channel.send("huehue i am in a voice channel >:3 " + msg.guild.voice.channel)
      
    } else {
      return msg.channel.send("im not in a voice channel :3");
    }
  }
}