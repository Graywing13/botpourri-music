"use strict";

const removeFlagIfFound = require("../general_cmd/tools/flag").removeFlagIfFound;
const queueSonginfo = require("./tools/queueSonginfo").execute;

let loopRandom = false;

module.exports = { 
  name: 'loopqueue',
  alias: 'lq',
  description: '',
  requiresServerQueue: true,
  usage: "",
  execute: async function(msg, serverQueue, args) {
    serverQueue.queueLoop = !(serverQueue.queueLoop);
    (serverQueue.queueLoop) ? (msg.channel.send(":repeat: Queue loop turned `on`.")) : (msg.channel.send(":arrow_right_hook: Queue loop turned `off`."));
    loopRandom = removeFlagIfFound(args, 'r');
  }, 
  queueLoop: function queueLoop(serverQueue) {
    const pushIndex = loopRandom ? Math.ceil(serverQueue.songs.length * Math.random()) : serverQueue.songs.length;
    queueSonginfo(serverQueue.songs, serverQueue.songs[0], pushIndex);
  }
}