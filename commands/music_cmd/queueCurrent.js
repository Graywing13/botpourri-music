const sendCommandUsageInfo = require("../general_cmd/sendCommandUsageInfo");
const queueSonginfo = require("./tools/queueSonginfo");
const flag = require("../general_cmd/tools/flag");

// PURPOSE: queues the given song into the specified/random position as indicated. 
module.exports = { 
  name: 'queueCurrent',
  alias: 'qc',
  description: 'Adds the currently playing song to the queue. \n`-r` flag adds the song to a random position. \nInput an integer to indicate the song position to add into.',
  args: 0,
  requiresServerQueue: true,
  usage: "queuecurrent <-r | index>",
  execute: function(msg, serverQueue, args) {
    if (serverQueue.songs.length === 0) {
      return msg.channel.send("The queue is empty. Please add songs via the `play` command before calling this command.")
    }
    let index;
    let hasFlag = flag.removeFlagIfFound(args, 'r');
    if (hasFlag) {
      index = Math.ceil(serverQueue.songs.length * Math.random());
    }
    else if (!args.length) {
      index = serverQueue.songs.length;
    } 
    else {
      try {
        index = parseInt(args[0]);
        if (index === 0) {
          return msg.reply("Please select a non-zero position.");
        }
      } catch (e) {
        return msg.reply("Invalid list position selected: " + e);
      }
    } 
    try {
      return msg.reply("Queuing: " + queueSonginfo.execute(serverQueue.songs, serverQueue.songs[0], index));
    } catch (e) {
      console.log("TEST qc.js: " + e);
      return sendCommandUsageInfo.execute(msg, this.name, e);
    }
  }
}

