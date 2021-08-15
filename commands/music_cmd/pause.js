"use strict";

module.exports = { 
  name: 'pause',
  alias: 'pause',
  description: 'pause',
  args: false,
  requiresServerQueue: true,
  usage: "<>",
  execute: async function(msg, serverQueue, args = []) {
    // TODO get mutex to serverQueue
    await serverQueue.connection.dispatcher.pause();
    serverQueue.playing = false;
    // TODO release mutex to serverQueue
    msg.channel.send(":pause_button: Paused.");
  }
}
