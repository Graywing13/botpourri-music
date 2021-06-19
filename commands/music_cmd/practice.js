const shuffleArray = require("./tools/shuffleArray");
const queueSonginfo = require("./tools/queueSonginfo");
const play = require("./play").execute;

const msgStringMaxLen = 500;

module.exports = { 
  name: 'practice',
  alias: 'pr',
  description: 'practice <song tag>',
  args: true, 
  requiresServerQueue: true,
  requiresSameCall: true,
  usage: "<tag>",
  execute: async function(msg, serverQueue, args) {
    const songFile = "C:/Users/chann/Desktop/Coding/JavaScript/AMQ Web Scrapers/gatheredData/songs/songs.json";
    const songs = require(songFile);
    args = args.map(arg => arg.toLowerCase());
    // 1. enqueue all songs with a certain tag (#TODO or omission of a certain tag)
    let msgString = "";
    for (var song in songs) {
      const songInfo = songs[song];
      if (songInfo.tags.some(tag => args.includes(tag.toLowerCase()))) {
        msgString += queueSonginfo.execute(msg, serverQueue.songs, songInfo);
        if (msgString.length > msgStringMaxLen) {
          msg.channel.send(msgString);
          msgString = "";
        }
      }
    }
    // 2. call play 
    shuffleArray.execute(serverQueue.songs);
    msgString += `\:grey_exclamation: All songs with tags \`${args.toString(args)}\` have been added to queue.`;
    msg.channel.send(msgString);
    play(msg, serverQueue);

    // 3. if there are currently songs in queue, ask whether to clear them. 
    // TODO: getUserResponse tool: use emotes
  }
}
