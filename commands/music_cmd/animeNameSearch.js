// Pepega spaghetti #TODO

module.exports = { 
  name: 'animesearch',
  alias: 'as',
  description: 'animesearch <show name>',
  args: true,
  requiresServerQueue: true,
  usage: "",
  execute: async function(msg, serverQueue, args) {
    const songFile = "C:/Users/chann/Desktop/Coding/JavaScript/AMQ Web Scrapers/gatheredData/songs/songs.json";
    const songs = require(songFile);
    let toSearch = "";
    // 1. get search
    for (const arg of args) {
      if (toSearch !== "") {
        toSearch += " ";
      }
      toSearch += arg;
    }
    console.log(`toSearch: ${toSearch}`);

    // 2. enqueue all songs with key word(s) in name
    // TODO extract out flag function (also in queueCurrent)
    let msgString = "";
    let matchExact = args.includes("-e") || args.includes("-E");
    for (var song in songs) {
      const songInfo = songs[song];
      if (matchExact) {
        if (songInfo.animeName === toSearch) {
          msgString += queueSonginfo.execute(msg, serverQueue.songs, songInfo);
        }
      } else if (songInfo.animeName.search(new RegExp(toSearch, "i")) > -1) {
        msgString += queueSonginfo.execute(msg, serverQueue.songs, songInfo);
      }
    }

    // 3. call play 
    msgString += `\:grey_exclamation: All songs with tags \`${args.toString(args)}\` have been added to queue.`;
    msg.channel.send(msgString);
    msg.channel.send(`\:grey_exclamation: All songs with a show name \`${toSearch}\` have been added to queue.`);

    // 3. if there are currently songs in queue, ask whether to clear them. 
  }
}
