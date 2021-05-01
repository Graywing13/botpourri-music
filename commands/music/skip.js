module.exports = { 
  name: 'skip',
  description: 'play <song url>',
  execute(msg, args) {
    return msg.channel.send("skip!");
  }
}