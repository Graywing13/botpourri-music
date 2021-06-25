module.exports = { 
  name: 'pause',
  alias: 'pause',
  description: 'pause',
  args: false,
  requiresServerQueue: true,
  usage: "<>",
  execute: async function(msg, serverQueue, args) {
    serverQueue.playing = false;
    serverQueue.connection.dispatcher.pause();
    msg.channel.send(":pause_button: Paused.");
  }
}
