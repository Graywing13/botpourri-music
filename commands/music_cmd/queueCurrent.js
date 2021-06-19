const sendCommandUsageInfo = require("../general_cmd/sendCommandUsageInfo");
const queueSonginfo = require("./tools/queueSonginfo");

// PURPOSE: queues the given song into the specified/random position as indicated. 
module.exports = { 
  name: 'queueCurrent',
  alias: 'qc',
  description: 'Adds the currently playing song to the queue. \n`-r` tag adds the song to a random position. \nInput an integer to indicate the song position to add into.',
  args: 0,
  requiresServerQueue: true,
  usage: "queuecurrent <-r | index>",
  execute: function(msg, serverQueue, args) {
    if (serverQueue.songs.length === 0) {
      return msg.channel.send("The queue is empty. Please add songs via the `play` command before calling this command.")
    }
    if (!args.length) {
      queueSonginfo.execute(msg, serverQueue.songs, serverQueue.songs[0], serverQueue.songs.length);
    }
    else if (args.includes("-r") || args.includes("-R")) {
      const index = Math.ceil(serverQueue.songs.length * Math.random());
      serverQueue.songs.splice(index, 0, serverQueue.songs[0])
    }
    else {
      try {
        if (parseInt(args[0]) === '0') {
          return msg.reply("Please select a non-zero position.");
        }
        msg.reply(queueSonginfo.execute(msg, serverQueue.songs, serverQueue.songs[0], parseInt(args[0])));
      } catch (e) {
        sendCommandUsageInfo.execute(msg, this.name, e);
      }
    }
  }
}

