module.exports = { 
  name: 'skip',
  description: 'skip',
  usage: "",
  requiresServerQueue: true,
  execute(msg, requiresServerQueue, args) {
    return msg.channel.send("skip!");
  }
}