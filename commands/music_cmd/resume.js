module.exports = { 
  name: 'resume',
  alias: 'resume',
  description: 'resume',
  args: false,
  requiresServerQueue: true,
  usage: "<>",
  execute: async function(msg, serverQueue, args) {
    serverQueue.playing = true;
    serverQueue.connection.dispatcher.resume();
    msg.channel.send(":arrow_forward: Resuming.");
  }
}
