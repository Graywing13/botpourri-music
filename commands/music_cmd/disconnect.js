"use strict";

module.exports = { 
  name: 'disconnect',
  alias: 'dc',
  description: 'disconnect',
  args: false,
  requiresServerQueue: true,
  usage: "<>",
  execute: async function(msg, serverQueue, args) {
    serverQueue.songs = [];
    serverQueue.playing = false;
    serverQueue.loop = false;
    serverQueue.queueLoop = false;
    serverQueue.memberVoiceState = undefined;
    serverQueue.initialized = false;
    serverQueue.connection = undefined;
    
    if (msg.guild.me.voice.channel === undefined) return msg.channel.send("I am not in a voice channel :upside_down:");
 
    try {
      await msg.guild.me.voice.channel.leave();
    } catch (e) {
      return msg.channel.send("Channel already left dechu.");
    }
    
    
    msg.channel.send("Successfully disconnected.");
  }
}
