const untagSingular = require("../../../../../../JavaScript/AMQ Web Scrapers/managementScripts/tagSongs").untagSingular;
const getSongInfo = require("../music_cmd/tools/sendSongInfo").getSongInfo;
const getSong = require("../music_cmd/tools/getSongs").getSong;

const regexListIndex = /^\s*\d+(\s*\,\s*(0-9)+)*\s*$/;

module.exports = { 
  name: 'tagremove',
  alias: 'tr',
  description: '',
  requiresServerQueue: true,
  args: 0,
  usage: "",
  async execute(msg, serverQueue, args) {
    const songInfo = getSong(serverQueue.songs[0].personalSongID);
    let successfulUntag = [];
    let unsuccessfulUntag = [];
    // if there was one or more args, loop through each one and untag. 
    // if untagSingular was unsuccessful for all of em, pretend there are no args. 
    var attemptUntag = function(tags) {
      let someSuccessful = false;
      tags.forEach(tag => {
        if (untagSingular(tag, songInfo.personalSongID.toString())) {
          successfulUntag.push(tag);
          someSuccessful = true;
        } else {
          unsuccessfulUntag.push(tag);
        }
      });
      return someSuccessful;
    }

    // if there were no args, write a list of every tag in it and wait for user input. 
    if (!attemptUntag(args)) {
      askTags(msg, songInfo);
      const filter = m => (regexListIndex.test(m.content) && m.author == msg.author);
      msg.channel.awaitMessages(filter, {
        max: 1,
        time: 30000,
        errors: ['time']
      }).then(collected => {
        console.log(collected);
        let m = collected.first();
        let toUntag = turnIndexToTag(songInfo.tags, m);
        attemptUntag(toUntag);
        sendUntagResults(msg, songInfo, successfulUntag, unsuccessfulUntag);
      }).catch(collected => {
        console.log("Error from tagRemove: " + collected);
        msg.reply("command timed out.")
      })
    } else {
      sendUntagResults(msg, songInfo, successfulUntag, unsuccessfulUntag);
    }
  }
}

// PURPOSE: sends a message asking user which tags they want to remove
function askTags(msg, songInfo) {
  let ask = "Which of the following tags would you like to remove? ```JavaScript";
  let count = 1;
  songInfo.tags.forEach(tag => {
    ask += `\n[${count++}]  ${tag}`
  })
  msg.reply(ask + "```");
}

// PURPOSE: 
function turnIndexToTag(tags, requestMessage) {
  let ret = [];
  requestMessage.content.replace(/\s/,'').split(",").forEach(tagIndex => {
    try {
      ret.push(tags[parseInt(tagIndex) - 1]);
    } catch (e) {
      requestMessage.channel.send(`Error grabbing index ${tagIndex}`);
      console.log(e)
    }
  });
  return ret;
}

// PURPOSE: sends the untag results. 
function sendUntagResults(msg, songInfo, successfulUntag, unsuccessfulUntag) {
  let ret = `__Untag Results__\nSong Info: *${getSongInfo(songInfo)}*`;
  if (successfulUntag.length > 0) {
    ret += "\nTags successfully removed: ";
    successfulUntag.forEach(tag => ret += `\`${tag}\` `);
  } else {
    ret += "\nNo songs were untagged successfully. "
  }
  if (unsuccessfulUntag.length > 0) {
    ret += "\nError in removing the following tags: ";
    unsuccessfulUntag.forEach(tag => ret += `\`${tag}\` `);
  } else {
    ret += "\nUntagging complete. "
  }
  return msg.reply(ret);
}