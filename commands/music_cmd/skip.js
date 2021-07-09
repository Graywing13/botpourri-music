"use strict";

module.exports = { 
  name: 'skip',
  alias: 'fs',
  description: 'skip',
  usage: "",
  requiresServerQueue: true,
  execute(msg, serverQueue, args) {
    if (!msg.guild.me.voice || serverQueue.songs.length < 1) {
      return msg.reply("Nothing playing in this server :camping:");
    }
    if (!msg.member.voice.channel || msg.member.voice.channel != msg.guild.me.voice.channel) {
      return msg.channel.send("You have to be in the same channel as botpourri to skip :3");
    }
    serverQueue.connection.dispatcher.end();
    return msg.channel.send(":fast_forward: skip!");
  }
}