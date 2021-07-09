"use strict";

module.exports = { 
  name: 'resume',
  alias: 'resume',
  description: 'resume',
  args: false,
  requiresServerQueue: true,
  usage: "<>",
  execute: async function(msg, serverQueue, args = []) {
    // TODO get mutex to serverQueue
    serverQueue.playing = true;
    serverQueue.connection.dispatcher.resume();
    // TODO release mutex to serverQueue
    msg.channel.send(":arrow_forward: Resuming.");
  }
}
