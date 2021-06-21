const shuffleArray = require("./tools/shuffleArray").execute;
const play = require("./play").execute;
const removeFlagIfFound = require("../general_cmd/tools/flag").removeFlagIfFound;
const conditionalAddToQueue = require("./tools/queueSonginfo").conditionalAddToQueue;

module.exports = { 
  name: 'practice',
  alias: 'pr',
  description: 'practice <song tag>. -o flag to match only one tag; default is match all tags.',
  args: true, 
  requiresServerQueue: true,
  requiresSameCall: true,
  usage: "<tag>",
  execute: async function(msg, serverQueue, args) {
    const songFile = "C:/Users/chann/Desktop/Coding/JavaScript/AMQ Web Scrapers/gatheredData/songs/songs.json";
    const songs = require(songFile);
    const hasOneFlag = removeFlagIfFound(args, 'o');
    const hasShuffleFlag = removeFlagIfFound(args, 's');
    args = args.map(arg => arg.toLowerCase());
    
    // 1. enqueue all songs with a certain tag (#TODO or omission of a certain tag)
    let msgString = "";
    let numAdded = 0;
    try {
      for (const song in songs) {
        const songInfo = songs[song];
        const addedSong = (hasOneFlag ? (conditionalAddToQueue(msg, args.some(tag => songInfo.tags.includes(tag.toLowerCase())), serverQueue, songInfo, msgString)) : (conditionalAddToQueue(msg, args.every(tag => songInfo.tags.includes(tag.toLowerCase())), serverQueue, songInfo, msgString)));
        if (addedSong != null) {
          numAdded += 1;
          msgString = addedSong;
        }
      }
      if (msgString.length) msg.channel.send(msgString);
      msg.reply(`All \`${numAdded}\` songs with ${hasOneFlag ? "at least one of " : "all of "} the tags \`${args.toString(args)}\` have been added to queue.`);
    } catch (e) {
      console.log(e)
      if (msgString.length) msg.channel.send(msgString);
      msg.reply(`\`${numAdded}\` songs were added to the queue before the following error was encountered:\n\`\`\`${e}\`\`\``);
    }
    // 3. shuffle
    if (hasShuffleFlag) {
      msg.channel.send(":twisted_rightwards_arrows: shuffling queue... ");
      shuffleArray(serverQueue.songs);
    }
    msg.channel.send(":arrow_forward: playing queue... ");
    play(msg, serverQueue);

    // 4. TODO if there are currently songs in queue, ask whether to clear them. 
    // TODO: getUserResponse tool: use emotes
  }
}
