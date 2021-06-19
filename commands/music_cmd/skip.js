module.exports = { 
  name: 'skip',
  alias: 'fs',
  description: 'skip',
  usage: "",
  requiresServerQueue: true,
  execute(msg, serverQueue, args) {
    if (!msg.member.voice.channel || msg.member.voice.channel != serverQueue.memberVoiceState.channel) {
      return msg.channel.send("You have to be in the same channel as botpourri to skip :3");
    }
    serverQueue.connection.dispatcher.end();
    return msg.channel.send(":fast_forward: skip!");
  }
}