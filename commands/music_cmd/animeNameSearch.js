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
    console.log(`args: ${args} with length ${args.length}`);
    for (const arg of args) {
      console.log(`arg: ${arg}`);
      if (toSearch !== "") {
        toSearch += " ";
      }
      toSearch += arg;
    }
    console.log(`toSearch: ${toSearch}`);

    // 2. enqueue all songs with key word(s) in name
    for (var song in songs) {
      const songInfo = songs[song];
    
      if (songInfo.animeName.search(new RegExp(toSearch, "i")) > -1) {
        serverQueue.songs.push(songInfo);
        msg.channel.send(`Queued ${songInfo.songName} (\`${songInfo.songURL}\`) by ${songInfo.songArtist}. This is ${songInfo.songType}${songInfo.songNumber} from \`${songInfo.animeName}\`.`);
      }
    }
    // 2. call play 
    msg.channel.send(`\:grey_exclamation: All songs with a show name \`${toSearch}\` have been added to queue.`);

    // 3. if there are currently songs in queue, ask whether to clear them. 
  }
}
