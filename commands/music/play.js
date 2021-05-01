module.exports = { 
  name: 'play',
  description: 'play <song url>',
  execute(msg, args) {
    return msg.channel.send("play!");
  }
}