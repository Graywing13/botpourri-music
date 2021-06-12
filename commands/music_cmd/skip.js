module.exports = { 
  name: 'skip',
  alias: 'fs',
  description: 'skip',
  usage: "",
  requiresServerQueue: true,
  execute(msg, serverQueue, args) {
    if (!msg.member.voice.channel) {
      return msg.channel.send("You have to be in a channel to skip :3");
    }
    serverQueue.connection.dispatcher.end();
    return msg.channel.send(":fast_forward: skip!");
  }
}