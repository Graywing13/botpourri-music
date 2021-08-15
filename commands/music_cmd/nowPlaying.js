"use strict";

const sendSongInfo = require("./tools/sendSongInfo").sendSongInfo;

module.exports = { 
  name: 'nowplaying',
  alias: 'np',
  description: 'play <song url>',
  requiresServerQueue: true,
  usage: "",
  execute: async function(msg, serverQueue, args) {
    try {
      sendSongInfo(msg, serverQueue.songs[0], true);
    } catch(err) {
      msg.channel.send("Something is wrong with the server queue dechu.")
      console.log(err);
    }
  }
}