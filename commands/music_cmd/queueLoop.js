module.exports = { 
  name: 'loopqueue',
  alias: 'lq',
  description: '',
  requiresServerQueue: true,
  usage: "",
  execute: async function(msg, serverQueue, args) {
    serverQueue.queueLoop = !(serverQueue.queueLoop);
    (serverQueue.queueLoop) ? (msg.channel.send("Queue loop turned `on`.")) : (msg.channel.send("Queue loop turned `off`."));
  }
}