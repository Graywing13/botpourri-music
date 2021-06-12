module.exports = { 
  name: 'practice',
  alias: 'pr',
  description: 'practice <song tag>',
  args: true, 
  requiresServerQueue: true,
  usage: "<tag>",
  execute: async function(msg, serverQueue, args) {
    const songFile = "C:/Users/chann/Desktop/Coding/JavaScript/AMQ Web Scrapers/gatheredData/songs/songs.json";
    const songs = require(songFile);
    args = args.map(arg => arg.toLowerCase());
    // 1. enqueue all songs with a certain tag (#TODO or omission of a certain tag)
    for (var song in songs) {
      const songInfo = songs[song];
      if (songInfo.tags.some(tag => args.includes(tag.toLowerCase()))) {
        serverQueue.songs.push(songInfo);
        msg.channel.send(`Queued ${songInfo.songName} (\`${songInfo.songURL}\`) by ${songInfo.songArtist}. This is ${songInfo.songType}${songInfo.songNumber} from \`${songInfo.animeName}\`.`);
      }
    }
    // 2. call play 
    const shuffleArray = require("./tools/shuffleArray");
    shuffleArray.execute(serverQueue.songs);
    msg.channel.send(`\:grey_exclamation: All songs with tags \`${args.toString(args)}\` have been added to queue.`);

    // 3. if there are currently songs in queue, ask whether to clear them. 
  }
}
