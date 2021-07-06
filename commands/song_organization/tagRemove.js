const untagSingular = require("../../../../../../JavaScript/AMQ Web Scrapers/managementScripts/tagSongs").untagSingular;
const getSongInfo = require("../music_cmd/tools/sendSongInfo").getSongInfo;

module.exports = { 
  name: 'tagremove',
  alias: 'tr',
  description: '',
  args: 0,
  usage: "",
  execute(msg, args) {
    const songInfo = serverQueue.songs[0];
    let successfulUntag = [];
    let unsuccessfulUntag = [];
    // if there was one or more args, loop through each one and untag. 
    // if untagSingular was unsuccessful for all of em, pretend there are no args. 
    const someSuccessful = args.some(tag => {
      untagSingular(tag, songInfo.personalSongID.toString()) ? successfulUntag.push(tag) : unsuccessfulUntag.push(tag);
    });
    
    // if there were no args, write a list of every tag in it and wait for user input. 
    if (!someSuccessful) {
      askTags(msg);
      const filter = m => (m.content.includes(/^\s*\d+(\s*\,\s*(0-9)+)*\s*$/) && m.author == msg.author);
      msg.channel.awaitMessages(filter, {
        max: 1,
        time: 30000,
        errors: ['time']
      }).then(collected => {
        let toUntag = turnIndexToTag(collected);
        toUntag.some(tag => {
          untagSingular(tag, songInfo.personalSongID.toString()) ? successfulUntag.push(tag) : unsuccessfulUntag.push(tag);
        });
      })
    }

    let ret = `**Untag Results**\nSong Info: ${getSongInfo}`;
    if (successfulUntag.length > 0) {
      ret += "\nTags successfully removed: ";
      successfulUntag.forEach(tag => ret += `\`${tag}\' `);
    } else {
      ret += "\nNo songs were untagged successfully. "
    }
    if (unsuccessfulUntag.length > 0) {
      ret += "\nError in removing the following tags: ";
      successfulUntag.forEach(tag => ret += `\`${tag}\' `);
    } else {
      ret += "\nUntagging complete. "
    }
    msg.reply(ret);
  }
}

// PURPOSE: sends a message asking user which tags they want to remove
function askTags(msg) {
  let ask = "Which of the following tags would you like to remove? ```JavaScript";
  let count = 1;
  songInfo.tags.forEach(tag => {
    ask += `\n[${count}]  ${tag}`
  })
  msg.reply(ask + "```");
}

// PURPOSE: 
function turnIndexToTag(requestMessage) {
  let ret = [];
  requestMessage.content.replace(/\s/,'').split(",").forEach(tagIndex => {
    try {
      ret.push(tags[tagIndex]);
    } catch (e) {
      requestMessage.channel.send(`Error grabbing index ${tagIndex}`);
    }
  });
  return ret;
}