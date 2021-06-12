module.exports = { 
  name: 'resume',
  alias: 'resume',
  description: 'resume',
  args: false,
  requiresServerQueue: true,
  usage: "<>",
  execute: async function(msg, serverQueue, args) {
    serverQueue.connection.dispatcher.resume();
    msg.channel.send(":play_pause: Resuming.");
  }
}
