// TODO move songfile to inside musicbpri
const songFile = "C:/Users/chann/Desktop/Coding/JavaScript/AMQ Web Scrapers/gatheredData/songs/songs.json";

const shuffleArray = require("./tools/shuffleArray").execute;
const play = require("./play").execute;
const removeFlagIfFound = require("../general_cmd/tools/flag").removeFlagIfFound;
const getFieldIfFound = require("../general_cmd/tools/field").getFieldIfFound;
const parseFieldRange = require("../general_cmd/tools/field").parseFieldRange;
const addToQueue = require("./tools/queueSonginfo").addToQueue;

module.exports = { 
  name: 'practice',
  alias: 'pr',
  description: 'practice <song tag>. -o flag to match only one tag; default is match all tags.',
  args: true, 
  requiresServerQueue: true,
  requiresSameCall: true,
  usage: "<tag>",
  execute: async function(msg, serverQueue, args) {
    const songs = require(songFile);
    args = args.map(arg => arg.toLowerCase());
    const regArgs = args.filter(arg => !arg.match(/^\-/));
    const fArgs = args.filter(arg => arg.match(/^\-/));
    const hasOneFlag = removeFlagIfFound(fArgs, 'o');
    const hasShuffleFlag = removeFlagIfFound(fArgs, 's');
    const hasNegationFlag = removeFlagIfFound(fArgs, 'n');
    const hasDifficultyField = parseFieldRange(getFieldIfFound(fArgs, 'd'));
    let songPool = []
    

    // 4. TODO if there are currently songs in queue, ask whether to clear them. 
    // TODO: getUserResponse tool: use emotes
    
    // 1. enqueue all songs with a certain tag 
    let msgString = "";
    let numAdded = 0;
    try {
      for (const song in songs) {
        const songInfo = songs[song];
        // checks for difficulty gate 
        if (hasDifficultyField 
          && (hasDifficultyField[0] > songInfo.minDifficulty || hasDifficultyField[1] < songInfo.maxDifficulty)) {
            continue;
          }
        // checks for tag omission flag and whether tags includes target word(s)
        if (hasNegationFlag !== (hasOneFlag ?
          (regArgs.some(tag => songInfo.tags.includes(tag.toLowerCase())))
          : (regArgs.every(tag => songInfo.tags.includes(tag.toLowerCase()))))) {
            songPool.push(songInfo);
          }
      }
      
      // 3. shuffle
      if (hasShuffleFlag) {
        msg.channel.send(":twisted_rightwards_arrows: shuffling queue... ");
        shuffleArray(songPool);
      }
      songPool.forEach(songInfo => {
        msgString = addToQueue(msg, serverQueue, songInfo, msgString);
        numAdded += 1;
      });
      // send any residue text still in msgString
      if (msgString.length) msg.channel.send(msgString);
      msg.reply(`All \`${numAdded}\` songs ${hasNegationFlag ? "without" : "with"} ${hasOneFlag ? "at least one of" : "all of"} the tags \`${regArgs.toString(regArgs)}\` have been added to queue.`);
    } catch (e) {
      console.log(e)
      if (msgString.length) msg.channel.send(msgString);
      msg.reply(`\`${numAdded}\` songs were added to the queue before the following error was encountered:\n\`\`\`${e}\`\`\``);
    }
    msg.channel.send(":arrow_forward: playing queue... ");
    play(msg, serverQueue, fArgs);
  }
}
