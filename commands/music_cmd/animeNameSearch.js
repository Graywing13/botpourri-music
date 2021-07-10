"use strict";

const removeFlagIfFound = require("../general_cmd/tools/flag").removeFlagIfFound;
const play = require("../music_cmd/play").execute;
const conditionalAddToQueue = require("./tools/queueSonginfo").conditionalAddToQueue;
const getSearch = require("../music_cmd/tools/getSearch").execute;
const shuffleArray = require("./tools/shuffleArray").execute;
const getSongs = require("./tools/getSongs").execute;


module.exports = { 
  name: 'animesearch',
  alias: 'as',
  description: 'animesearch <show name>',
  args: true,
  requiresSameCall: true,
  requiresServerQueue: true,
  usage: "",
  execute: async function(msg, serverQueue, args) {
    const songs = getSongs();
    const regArgs = args.filter(arg => !arg.match(/^\-/));
    const fArgs = args.filter(arg => arg.match(/^\-/));
    const hasExactFlag = removeFlagIfFound(fArgs, 'e');
    const hasShuffleFlag = removeFlagIfFound(fArgs, 's');
    // 1. get search
    let toSearch = getSearch(regArgs);

    // 2. enqueue all songs with key word(s) in name
    let msgString = "";
    let numAdded = 0;
    try {
      for (const song in songs) {
        const songInfo = songs[song];
        const addedSong = (hasExactFlag ? (conditionalAddToQueue(msg, songInfo.animeName.toLowerCase() === toSearch, serverQueue, songInfo, msgString)) : (conditionalAddToQueue(msg, songInfo.animeName.search(new RegExp(toSearch, "i")) > -1, serverQueue, songInfo, msgString)));
        if (addedSong != undefined) {
          numAdded += 1;
          msgString = addedSong;
        }
      }
      if (msgString.length) msg.channel.send(msgString);
      msg.reply(`\:grey_exclamation: All \`${numAdded}\` songs with a show name \`${toSearch}\` have been added to queue.`);
    } catch (e) {
      console.log(e)
      if (msgString.length) msg.channel.send(msgString);
      msg.reply(`\`${numAdded}\` songs were added to the queue before the following error was encountered:\n\`\`\`${e}\`\`\``);
    }

    // 3. call play 
    if (hasShuffleFlag) {
      msg.channel.send(":twisted_rightwards_arrows: shuffling queue... ");
      shuffleArray(serverQueue.songs);
    }
    msg.channel.send(":arrow_forward: playing queue... ");
    play(msg, serverQueue, fArgs);

    // 4. TODO if there are currently songs in queue, ask whether to clear them. 
    // hello
    
  }
}