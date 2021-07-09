"use strict";

module.exports = { 
  name: 'nowplaying',
  alias: 'np',
  description: 'play <song url>',
  requiresServerQueue: true,
  usage: "",
  execute: async function(msg, serverQueue, args) {
    try {
      const sendSongInfo = require("./tools/sendSongInfo");
      sendSongInfo.execute(msg, serverQueue.songs[0], true);
      msg.channel.send("This song has been playing for " + (serverQueue.connection.dispatcher.streamTime / 1000) + "s.");
    } catch(err) {
      msg.channel.send("Something is wrong with the server queue dechu.")
      console.log(err);
    }
  }
}