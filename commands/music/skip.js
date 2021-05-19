module.exports = { 
  name: 'skip',
  description: 'skip',
  usage: "",
  execute(msg, args) {
    return msg.channel.send("skip!");
  }
}