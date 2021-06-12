module.exports = { 
  name: 'loop',
  alias: 'l',
  description: '',
  requiresServerQueue: true,
  usage: "",
  execute: async function(msg, serverQueue, args) {
    serverQueue.loop = !(serverQueue.loop);
    (serverQueue.loop) ? (msg.channel.send(":repeat_one: Loop turned `on`.")) : (msg.channel.send(":arrow_right_hook: Queue loop turned `off`."));
  }
}