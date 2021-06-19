const queueSonginfo = require("./tools/queueSonginfo");
const msgStringMaxLen = 500;

module.exports = { 
  name: 'animesearch',
  alias: 'as',
  description: 'animesearch <show name>',
  args: true,
  requiresSameCall: true,
  requiresServerQueue: true,
  usage: "",
  execute: async function(msg, serverQueue, args) {
    const songFile = "C:/Users/chann/Desktop/Coding/JavaScript/AMQ Web Scrapers/gatheredData/songs/songs.json";
    const songs = require(songFile);
    let toSearch = "";
    let matchExact = Math.max(args.indexOf("-e"), args.indexOf("-E"));
    // 1. get search
    if (matchExact > -1) {
      args.splice(matchExact, 1);
    }
    console.log(`arglist ${args}`)
    for (const arg of args) {
      if (toSearch !== "") {
        toSearch += " ";
      }
      toSearch += arg;
    }
    toSearch = toSearch.toLowerCase();
    console.log(`toSearch: ${toSearch}`);
    

    // 2. enqueue all songs with key word(s) in name
    // TODO extract out flag function (also in queueCurrent)
    let msgString = "";
    for (var song in songs) {
      const songInfo = songs[song];
      if (matchExact > -1) {
        if (songInfo.animeName.toLowerCase() === toSearch) {
          msgString += queueSonginfo.execute(msg, serverQueue.songs, songInfo);
        }
      } else if (songInfo.animeName.search(new RegExp(toSearch, "i")) > -1) {
        msgString += queueSonginfo.execute(msg, serverQueue.songs, songInfo);
        if (msgString.length > msgStringMaxLen) {
          msg.channel.send(msgString);
          msgString = "";
        }
      }
    }

    // 3. call play 
    msgString += `\:grey_exclamation: All songs with a show name \`${toSearch}\` have been added to queue.`;
    msg.channel.send(msgString);

    // 3. if there are currently songs in queue, ask whether to clear them. 
  }
}
