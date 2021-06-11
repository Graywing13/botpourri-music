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
    serverQueue.memberVoiceState = null;
    serverQueue.initialized = false;
    serverQueue.connection = null;
 
    await msg.guild.me.voice.channel.leave();
    
    msg.channel.send("Successfully disconnected.");
  }
}
