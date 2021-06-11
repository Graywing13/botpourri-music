module.exports = { 
  name: 'practice',
  alias: 'r',
  description: 'practice <song tag>',
  args: true,
  requiresServerQueue: true,
  usage: "<tag>",
  execute: async function(msg, serverQueue, args) {
    const songFile = "C:/Users/chann/Desktop/Coding/JavaScript/AMQ Web Scrapers/gatheredData/songs/songs.json";
    const songs = require(songFile);
    // 1. enqueue all songs with a certain tag (or omission of a certain tag)
    for (var song in songs) {
      const songInfo = songs[song];
      if (songInfo.tags.some(tag => args.includes(tag))) {
        serverQueue.songs.push(songInfo);
        msg.channel.send(`Queued ${songInfo.songName} (\`${targetSong}\`) by ${songInfo.songArtist}. This is ${songInfo.songType}${songInfo.songNumber} from \`${songInfo.animeName}\`.`);
      }
    }
    // 2. call play 
    msg.channel.send(`All songs with tags \`${args.toString(args)}\` have been added to queue.`)
  }
}
